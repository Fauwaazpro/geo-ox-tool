"use client"

import { useEffect, useRef } from "react"

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let particles: Array<{ x: number; y: number; vx: number; vy: number }> = []

        // Configuration
        const particleCount = 60
        const connectionDistance = 150
        const lineColor = "59, 130, 246" // Blue-500 (RGB) for lines

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initParticles()
        }

        const initParticles = () => {
            particles = []
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.4, // Gentle speed
                    vy: (Math.random() - 0.5) * 0.4,
                })
            }
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update and draw particles
            particles.forEach((p, i) => {
                p.x += p.vx
                p.y += p.vy

                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1

                // Draw Gradient Blue Particle
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 3.5)
                gradient.addColorStop(0, "rgba(147, 197, 253, 1)") // Blue-300 center (Bright)
                gradient.addColorStop(1, "rgba(37, 99, 235, 0.8)") // Blue-600 edge (Deep)

                ctx.beginPath()
                ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2) // Size 3.5 radius (7px diameter)
                ctx.fillStyle = gradient
                ctx.fill()

                // Draw Connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j]
                    const dx = p.x - p2.x
                    const dy = p.y - p2.y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist < connectionDistance) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(${lineColor}, ${0.4 * (1 - dist / connectionDistance)})` // Blue connecting lines
                        ctx.lineWidth = 1.2 // Thicker lines (was 0.5)
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.stroke()
                    }
                }
            })

            animationFrameId = requestAnimationFrame(draw)
        }

        resize()
        draw()
        window.addEventListener("resize", resize)

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
        />
    )
}
