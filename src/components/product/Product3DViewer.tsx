"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stage, Environment } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

function Model(props: any) {
    const meshRef = useRef<THREE.Mesh>(null!)

    useFrame((state, delta) => {
        // Auto-rotate
        meshRef.current.rotation.y += delta * 0.5
    })

    return (
        <mesh {...props} ref={meshRef}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="orange" roughness={0.1} metalness={0.5} />
        </mesh>
    )
}

export function Product3DViewer() {
    return (
        <div className="w-full h-[400px] md:h-[600px] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                3D View
            </div>
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
                <Stage environment="city" intensity={0.6}>
                    <Model />
                </Stage>
                <OrbitControls autoRotate={false} />
            </Canvas>
        </div>
    )
}
