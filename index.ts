import {
	IcosahedronGeometry,
	Mesh,
	MeshStandardMaterial,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
} from "three";
import { Light } from "./src/light";

const scene = new Scene();

const leftRenderer = new WebGLRenderer();
leftRenderer.setSize(window.innerWidth / 2, window.innerHeight);
document.body.appendChild(leftRenderer.domElement);

const rightRenderer = new WebGLRenderer();
rightRenderer.setSize(window.innerWidth / 2, window.innerHeight);
document.body.appendChild(rightRenderer.domElement);

const leftCamera = new PerspectiveCamera(
	75,
	window.innerWidth / 2 / window.innerHeight,
	0.1,
	1000,
);
leftCamera.position.x = 0.1;
leftCamera.position.z = 5;
leftCamera.lookAt(scene.position);

const rightCamera = new PerspectiveCamera(
	75,
	window.innerWidth / 2 / window.innerHeight,
	0.1,
	1000,
);
rightCamera.position.x = -0.1;
rightCamera.position.z = 5;
rightCamera.lookAt(scene.position);

window.addEventListener<"resize">(
	"resize",
	(() => {
		const tanFOV = Math.tan(((Math.PI / 180) * leftCamera.fov) / 2);
		const windowHeight = window.innerHeight;
		return () => {
			// left camera update
			leftCamera.aspect = window.innerWidth / 2 / window.innerHeight;
			leftCamera.fov =
				(360 / Math.PI) *
				Math.atan(tanFOV * (window.innerHeight / windowHeight));

			leftCamera.updateProjectionMatrix();
			leftCamera.lookAt(scene.position);

			leftRenderer.setSize(window.innerWidth / 2, window.innerHeight);

			// right camera update
			rightCamera.aspect = window.innerWidth / 2 / window.innerHeight;
			rightCamera.fov =
				(360 / Math.PI) *
				Math.atan(tanFOV * (window.innerHeight / windowHeight));

			rightCamera.updateProjectionMatrix();
			rightCamera.lookAt(scene.position);

			rightRenderer.setSize(window.innerWidth / 2, window.innerHeight);
		};
	})(),
);

const geometry = new IcosahedronGeometry();
const material = new MeshStandardMaterial({ color: 0xffffff });
const icosahedron = new Mesh(geometry, material);
scene.add(icosahedron);

const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0x00ffff, 0xff00ff];
const lights = colors.map((color) => new Light({ color, scene }));

const animate = (timestamp: number) => {
	const t = timestamp * 0.0005;

	// We use PI just as a generic irrational number
	// So that X and Y rotations have no common multiple
	icosahedron.rotation.x = t * 0.2 * Math.PI;
	icosahedron.rotation.y = t;

	lights.forEach((light) => light.update(timestamp));

	leftRenderer.render(scene, leftCamera);
	rightRenderer.render(scene, rightCamera);
	requestAnimationFrame(animate);
};

const settingsDialog = document.getElementById("settings") as HTMLDialogElement;
document
	.getElementById("settings-open")
	?.addEventListener("click", () => settingsDialog.showModal());
document
	.getElementById("settings-close")
	?.addEventListener("click", () => settingsDialog.close());

const eyeOffsetInput = document.getElementById(
	"eye-offset",
) as HTMLInputElement;
eyeOffsetInput.value = "5";
eyeOffsetInput.addEventListener("input", () => {
	const uiValue = parseInt(eyeOffsetInput.value);
	const inUniverseValue = uiValue / 10;
	leftCamera.position.x = inUniverseValue;
	leftCamera.lookAt(scene.position);
	rightCamera.position.x = -inUniverseValue;
	rightCamera.lookAt(scene.position);
});
const cameraDistanceInput = document.getElementById(
	"camera-distance",
) as HTMLInputElement;
cameraDistanceInput.value = "5";
cameraDistanceInput.addEventListener("input", () => {
	const uiValue = parseInt(cameraDistanceInput.value);
	const inUniverseValue = 2 + uiValue;
	leftCamera.position.z = inUniverseValue;
	leftCamera.lookAt(scene.position);
	rightCamera.position.z = inUniverseValue;
	rightCamera.lookAt(scene.position);
});

animate(performance.now());
