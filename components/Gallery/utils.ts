import * as THREE from "three";
import { extend } from "@react-three/fiber";

// Paul West @prisoner849 https://discourse.threejs.org/u/prisoner849
// https://discourse.threejs.org/t/simple-curved-plane/26647/10
class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(
    radius: number,
    ...args: ConstructorParameters<typeof THREE.PlaneGeometry>
  ) {
    super(...args);
    const p = this.parameters;
    const hw = p.width * 0.5;

    const sign = Math.sign(radius) || 1; // -1 for negative, 1 for positive
    const absRadius = Math.abs(radius);

    const a = new THREE.Vector2(-hw, 0);
    const b = new THREE.Vector2(0, absRadius);
    const c = new THREE.Vector2(hw, 0);

    const ab = new THREE.Vector2().subVectors(a, b);
    const bc = new THREE.Vector2().subVectors(b, c);
    const ac = new THREE.Vector2().subVectors(a, c);

    const r =
      (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)));

    const center = new THREE.Vector2(0, absRadius - r);
    const baseV = new THREE.Vector2().subVectors(a, center);
    let baseAngle = baseV.angle() - Math.PI * 0.5;
    let arc = baseAngle * 2;

    // flip arc if radius is negative
    arc *= sign;

    const uv = this.attributes.uv as THREE.BufferAttribute;
    const pos = this.attributes.position as THREE.BufferAttribute;
    const mainV = new THREE.Vector2();

    for (let i = 0; i < uv.count; i++) {
      const uvRatio = 1 - uv.getX(i);
      const y = pos.getY(i);

      mainV.copy(c).rotateAround(center, arc * uvRatio * sign);
      pos.setXYZ(i, mainV.x, y, -mainV.y * sign);
    }

    pos.needsUpdate = true;
  }
}

extend({ BentPlaneGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    bentPlaneGeometry: BentPlaneGeometry;
  }
}