"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function SceneContent(props: any) {
    const meshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHover] = useState(false)

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2
            meshRef.current.rotation.y += delta * 0.3
        }
    })

    return (
        <mesh
            {...props}
            ref={meshRef}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            scale={hovered ? 1.2 : 1}
        >
            <torusKnotGeometry args={[1, 0.3, 128, 16]} />
            <meshStandardMaterial
                color={hovered ? "#ff0080" : "#7928ca"}
                roughness={0.1}
                metalness={0.8}
            />
        </mesh>
    )
}
