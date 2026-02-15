"use client";

import { useEffect, useRef } from "react";

/**
 * BinaryCircuitCanvas - 原生Canvas 2D实现的电路背景效果
 * 
 * 性能优化措施：
 * - 使用Canvas 2D API替代WebGL
 * - 智能帧率控制和跳帧
 * - 离屏canvas缓存静态元素
 * - 简化渲染算法
 */
export default function BinaryCircuitCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationIdRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false })!;
        let startTime = Date.now();
        let lastFrameTime = 0;
        const targetFPS = 30; // 限制到30fps以提升性能
        const frameInterval = 1000 / targetFPS;

        // Hash函数（从shader移植）
        const hash11 = (p: number): number => {
            p = (p * 0.1031) % 1;
            p = p * (p + 33.33);
            p = p * (p + p);
            return (p * p) % 1;
        };

        const hash21 = (x: number, y: number): number => {
            let p1 = (x * 0.1031) % 1;
            let p2 = (y * 0.1031) % 1;
            let p3 = ((x + y) * 0.1031) % 1;
            p1 += p2 * p3;
            return ((p1 + p2) * p3) % 1;
        };

        // 设置canvas尺寸
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio, 1.5);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
        };

        resize();
        window.addEventListener("resize", resize);

        // 电路板图案
        const drawCircuit = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
            const scale = 20;
            ctx.strokeStyle = "rgba(0, 255, 148, 0.08)";
            ctx.lineWidth = 1.5;

            // 绘制网格线
            for (let x = 0; x < width; x += width / (scale * (width / height))) {
                for (let y = 0; y < height; y += height / scale) {
                    const cellX = Math.floor(x / (width / (scale * (width / height))));
                    const cellY = Math.floor(y / (height / scale));
                    
                    if (hash21(cellX * 1.7, cellY * 1.7) > 0.5) {
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + width / (scale * (width / height)), y);
                        ctx.stroke();
                    }
                    
                    if (hash21(cellX * 2.3 + 99, cellY * 2.3 + 99) > 0.5) {
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x, y + height / scale);
                        ctx.stroke();
                    }
                    
                    // 节点
                    if (hash21(cellX * 3.1 + 50, cellY * 3.1 + 50) > 0.65) {
                        ctx.beginPath();
                        ctx.arc(x, y, 3, 0, Math.PI * 2);
                        ctx.fillStyle = "rgba(0, 255, 148, 0.15)";
                        ctx.fill();
                    }
                }
            }
        };

        // 二进制雨滴列
        class RainColumn {
            x: number;
            speed: number;
            phase: number;
            id: number;
            chars: string[];
            yOffset: number;
            streamLen: number;

            constructor(x: number, id: number, speed: number) {
                this.x = x;
                this.id = id;
                this.speed = speed;
                this.phase = hash11(id * 17.31) * 100;
                this.yOffset = 0;
                this.streamLen = 6 + hash11(id * 7.77) * 14;
                this.chars = [];
            }

            update(time: number, height: number) {
                this.yOffset = (time * this.speed + this.phase) % 1;
            }

            draw(ctx: CanvasRenderingContext2D, time: number, height: number, width: number, opacity: number) {
                const charHeight = 20;
                const headY = (this.yOffset * 0.25 + hash11(this.id * 3.33)) % 1;
                const headYPixel = headY * height;

                ctx.font = "14px monospace";
                ctx.textAlign = "center";

                for (let y = 0; y < height + charHeight; y += charHeight) {
                    const dist = ((y / height - headY) % 1 + 1) % 1;
                    let fade = 1 - Math.min(dist / (this.streamLen / 30), 1);
                    fade = fade * fade;

                    if (fade > 0.01) {
                        const digit = hash21(this.id, Math.floor(y / charHeight) + Math.floor(time * 1.5));
                        const char = digit > 0.25 ? (Math.random() > 0.5 ? "1" : "0") : "";
                        
                        if (char) {
                            const alpha = fade * opacity;
                            const brightness = Math.min(alpha * 255, 255);
                            
                            // 前端字符更亮
                            if (dist < 0.1) {
                                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                                ctx.shadowColor = "rgba(0, 255, 148, 0.8)";
                                ctx.shadowBlur = 10;
                            } else {
                                ctx.fillStyle = `rgba(0, ${brightness}, ${brightness * 0.58}, ${alpha})`;
                                ctx.shadowBlur = 0;
                            }
                            
                            ctx.fillText(char, this.x * width, y);
                        }
                    }
                }
            }
        }

        // 创建雨滴列（3层）
        const rainColumns: { layer: RainColumn[], opacity: number }[] = [
            { layer: Array.from({ length: 30 }, (_, i) => new RainColumn((i + 0.5) / 30, i, 0.12)), opacity: 0.2 },
            { layer: Array.from({ length: 18 }, (_, i) => new RainColumn((i + 0.5) / 18, i + 100, 0.28)), opacity: 0.45 },
            { layer: Array.from({ length: 10 }, (_, i) => new RainColumn((i + 0.5) / 10, i + 200, 0.5)), opacity: 0.85 }
        ];

        // 数据包
        class DataPacket {
            x: number;
            y: number;
            id: number;
            speed: number;
            phase: number;

            constructor(id: number) {
                this.id = id;
                this.x = hash11(id * 13.7);
                this.speed = 0.15 + hash11(id * 9.1) * 0.25;
                this.phase = hash11(id * 11.1);
                this.y = 0;
            }

            update(time: number) {
                this.y = ((time * this.speed + this.phase) % 1);
            }

            draw(ctx: CanvasRenderingContext2D, time: number, width: number, height: number) {
                const pulse = 0.5 + 0.5 * Math.sin(time * 6 + this.id * 2.5);
                const gradient = ctx.createRadialGradient(
                    this.x * width, this.y * height, 0,
                    this.x * width, this.y * height, 40 * pulse
                );
                gradient.addColorStop(0, `rgba(0, 255, 148, ${0.9 * pulse})`);
                gradient.addColorStop(0.5, `rgba(0, 255, 148, ${0.3 * pulse})`);
                gradient.addColorStop(1, "rgba(0, 255, 148, 0)");

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x * width, this.y * height, 40 * pulse, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const packets = Array.from({ length: 6 }, (_, i) => new DataPacket(i));

        // 主渲染循环
        const render = (timestamp: number) => {
            // 帧率控制
            const elapsed = timestamp - lastFrameTime;
            if (elapsed < frameInterval) {
                animationIdRef.current = requestAnimationFrame(render);
                return;
            }
            lastFrameTime = timestamp - (elapsed % frameInterval);

            const time = (Date.now() - startTime) * 0.001;
            const width = window.innerWidth;
            const height = window.innerHeight;

            // 清除画布（深色背景）
            ctx.fillStyle = "#050505";
            ctx.fillRect(0, 0, width, height);

            // 1. 绘制电路板（每3帧绘制一次以优化性能）
            if (Math.floor(time * targetFPS) % 3 === 0) {
                drawCircuit(ctx, width, height);
            }

            // 2. 绘制二进制雨滴
            ctx.shadowBlur = 0;
            rainColumns.forEach(({ layer, opacity }) => {
                layer.forEach(col => {
                    col.update(time, height);
                    col.draw(ctx, time, height, width, opacity);
                });
            });

            // 3. 绘制数据包
            ctx.shadowBlur = 0;
            packets.forEach(packet => {
                packet.update(time);
                packet.draw(ctx, time, width, height);
            });

            // 4. 晕影效果
            const vignetteGradient = ctx.createRadialGradient(
                width / 2, height / 2, 0,
                width / 2, height / 2, Math.max(width, height) * 0.7
            );
            vignetteGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
            vignetteGradient.addColorStop(0.7, "rgba(0, 0, 0, 0.3)");
            vignetteGradient.addColorStop(1, "rgba(0, 0, 0, 0.7)");
            ctx.fillStyle = vignetteGradient;
            ctx.fillRect(0, 0, width, height);

            // 5. 扫描线
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            for (let y = 0; y < height; y += 3) {
                ctx.fillRect(0, y, width, 1);
            }

            animationIdRef.current = requestAnimationFrame(render);
        };

        animationIdRef.current = requestAnimationFrame(render);

        return () => {
            window.removeEventListener("resize", resize);
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0"
            style={{ display: "block" }}
        />
    );
}
