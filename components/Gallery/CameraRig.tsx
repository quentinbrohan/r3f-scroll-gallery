import { useFrame } from '@react-three/fiber';
import { easing } from 'maath'

interface CameraRigProps { }

export const CameraRig: React.FC<CameraRigProps> = () => {
    useFrame((state, delta) => {
        // const factor = 0.0125
        // easing.damp3(state.camera.position, [(-1 + (state.pointer.x * state.viewport.width) / 3) * factor, ((1 + state.pointer.y * state.viewport.height) / 2) * factor, state.camera.position.z], 0.5, delta)

        const factor = 100
        const targetX = state.pointer.x * factor;
        const targetY = state.pointer.y * factor;

        easing.damp3(
            state.camera.position,
            [targetX, targetY, state.camera.position.z],
            0.5,
            delta
        );
        state.camera.lookAt(0, 0, 0)
    })

    return null;
}