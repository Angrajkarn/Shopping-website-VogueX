"use client"

import { Canvas } from "@react-three/fiber"
import { Environment, Float, ContactShadows } from "@react-three/drei"
import { SceneContent } from "./SceneContent"

export function Scene3D() {
    return (
        <div className="h-[500px] w-full bg-black/5 relative overflow-hidden rounded-xl">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />

                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <SceneContent position={[0, 0, 0]} />
                </Float>

                <Environment preset="city" />
                <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
            </Canvas>
            <div className="absolute bottom-4 left-4 text-sm text-muted-foreground pointer-events-none">
                Interactive 3D Element • Drag to rotate • Hover to scale
            </div>
        </div>
    )
}
