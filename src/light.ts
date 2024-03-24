import {
	type Scene,
	PointLight,
	Mesh,
	MeshBasicMaterial,
	SphereGeometry,
} from "three";

export class Light {
	private pointLight: PointLight;
	private xScale: number;
	private xSpeed: number;
	private yScale: number;
	private ySpeed: number;
	private zScale: number;
	private zSpeed: number;
	constructor({ color, scene }: { color: number; scene: Scene }) {
		this.pointLight = new PointLight(color, 2, 50);
		this.pointLight.add(
			new Mesh(
				new SphereGeometry(0.1, 16, 8),
				new MeshBasicMaterial({ color }),
			),
		);
		scene.add(this.pointLight);
		this.xScale = 2 + Math.random();
		this.yScale = 2 + Math.random();
		this.zScale = 2 + Math.random();
		this.xSpeed = 0.00015 + 0.0002 * Math.random();
		this.ySpeed = 0.00015 + 0.0002 * Math.random();
		this.zSpeed = 0.00015 + 0.0002 * Math.random();
	}
	update(time: number) {
		this.pointLight.position.x = Math.sin(time * this.xSpeed) * this.xScale;
		this.pointLight.position.y = Math.sin(time * this.ySpeed) * this.yScale;
		this.pointLight.position.z = Math.sin(time * this.zSpeed) * this.zScale;
	}
}
