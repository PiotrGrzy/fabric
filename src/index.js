import fabric from 'fabric';
import './styles.scss';
console.log('index.js with webpack');

const imageInput = document.getElementById('image');
const bgImageInput = document.getElementById('bgImage');
const moveBgBtn = document.getElementById('moveBgBtn');
const addRectBtn = document.getElementById('addRect');
const addCircleBtn = document.getElementById('addCircle');
const addTextBtn = document.getElementById('addText');
const deleteBtn = document.getElementById('delete');
const clearCanvasBtn = document.getElementById('clearCanvas');
const colorPicker = document.getElementById('color');
const bgColorPicker = document.getElementById('bgColor');
const STATIC_URL =
  'https://cdn.pixabay.com/photo/2015/04/16/15/21/gunkanjima-725792_960_720.jpg';
const saveBtn = document.getElementById('save');
const loadFromStorageBtn = document.getElementById('fromStorage');
const exportBtn = document.getElementById('export');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const centerBtn = document.getElementById('center');
const moveFrontBtn = document.getElementById('moveFront');
const moveBackBtn = document.getElementById('moveBack');
const lockMovementBtn = document.getElementById('lockMovement');
const fontSizeSelect = document.getElementById('fontSize');
const fontFamilySelect = document.getElementById('fontFamily');

const modes = {
  default: 'default',
  pan: 'pan',
};

const state = {
  mousePressed: false,
  currentMode: modes.default,
  color: '#9c9797',
  fontSize: 24,
  fontFamily: 'Times New Roman',
  backgroundColor: '#ffffff',
  svg: {},
  width: 600,
  height: 800,
};

const initCanvas = () => {
  colorPicker.value = state.color;
  bgColorPicker.value = state.backgroundColor;
  widthInput.value = state.width;
  heightInput.value = state.height;
  return new fabric.Canvas('canvas', {
    height: state.height,
    width: state.width,
    backgroundColor: 'white',
  });
};

const clearCanvas = (svgState) => {
  state.svg.val = canvas.toSVG();
  canvas.getObjects().forEach((obj) => canvas.remove(obj));
  canvas.set('backgroundColor', state.backgroundColor);
  canvas.set('backgroundImage', null);
  canvas.requestRenderAll();
};

const setWidth = () => {
  const newWidth = parseInt(widthInput.value);
  if (newWidth) {
    state.width = newWidth;
    canvas.setWidth(newWidth);
  }
};

const setHeight = () => {
  const newHeight = parseInt(heightInput.value);
  if (newHeight) {
    state.height = newHeight;
    canvas.setHeight(newHeight);
  }
};

const saveToJson = () => {
  const json = JSON.stringify(canvas.toJSON());
  window.localStorage.setItem('canvas', json);
  console.log(json);
};

const restoreFromLocalStorage = () => {
  const saved = window.localStorage.getItem('canvas');
  if (saved) {
    console.log(JSON.parse(saved));
    canvas.loadFromJSON(saved);
    canvas.requestRenderAll();
  }
};

const restoreCanvas = () => {
  if (state.svg.val) {
    fabric.loadSVGFromString(state.svg.val, (objects) => {
      canvas.add(...objects);
      canvas.requestRenderAll();
    });
  }
};

const getCurrentActiveObj = () => {
  const obj = canvas.getActiveObject();
  return obj;
};

const setMoveBgOption = (e) => {
  moveBgBtn.classList.toggle('active');
  if (state.currentMode === modes.default) {
    state.currentMode = modes.pan;
    console.log(state.currentMode);
  } else {
    state.currentMode = modes.default;
  }
  canvas.requestRenderAll();
};

const setColor = (e) => {
  const obj = canvas.getActiveObject();
  state.color = e.target.value;
  if (obj) {
    obj.set('fill', state.color);
    canvas.requestRenderAll();
  }
};

const setBgColor = (e) => {
  canvas.backgroundColor = e.target.value;
  canvas.requestRenderAll();
};

const setFontSize = (e) => {
  state.fontSize = e.target.value;
  const obj = canvas.getActiveObject();
  if (obj && obj.type === 'i-text') {
    obj.set('fontSize', e.target.value);
    canvas.requestRenderAll();
  }
};

const setFontFamily = (e) => {
  state.fontFamily = e.target.value;
  const obj = canvas.getActiveObject();
  if (obj && obj.type === 'i-text') {
    obj.set('fontFamily', e.target.value);
    canvas.requestRenderAll();
  }
};

const addImage = (e) => {
  const image = imageInput.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(image);

  reader.addEventListener('load', () => {
    fabric.Image.fromURL(reader.result, (img) => {
      canvas.add(img);
      canvas.requestRenderAll();
    });
  });
};

const centerObj = () => {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.center();
    canvas.requestRenderAll();
    obj.setCoords();
  }
};

const moveBack = () => {
  const obj = canvas.getActiveObject();
  if (obj) {
    canvas.sendToBack(obj);
    canvas.requestRenderAll();
    obj.setCoords();
  }
};

const moveFront = () => {
  const obj = canvas.getActiveObject();
  if (obj) {
    canvas.bringToFront(obj);
    canvas.requestRenderAll();
    obj.setCoords();
  }
};

const lockObject = () => {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.lockMovementX = !obj.lockMovementX;
    obj.lockMovementY = !obj.lockMovementY;
  }
};

const addBackgroundImage = () => {
  console.log('add Bg');
  const image = bgImageInput.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(image);

  reader.addEventListener('load', () => {
    fabric.Image.fromURL(reader.result, (img) => {
      canvas.backgroundImage = img;
      canvas.requestRenderAll();
    });
  });
};

const exportToImage = () => {
  const dataURL = canvas.toDataURL({
    width: canvas.width,
    height: canvas.height,
    left: 0,
    top: 0,
    format: 'jpg',
  });
  const link = document.createElement('a');
  link.download = 'image.jpg';
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const addRectangle = () => {
  const rectangle = new fabric.Rect({
    width: 100,
    height: 100,
    fill: state.color,
  });
  canvas.add(rectangle);
};

const addCircle = () => {
  const circle = new fabric.Circle({
    fill: state.color,
    radius: 50,
  });
  canvas.add(circle);
};

const deleteObject = () => {
  const obj = getCurrentActiveObj();
  canvas.remove(obj);
};

const canvas = initCanvas(800, 600);

const addText = () => {
  const text = new fabric.IText('Nowy Tekst', {
    top: 200,
    left: 200,
    fontFamily: state.fontFamily,
    fontSize: state.fontSize,
  });
  canvas.add(text);
};

imageInput.addEventListener('change', addImage);
bgImageInput.addEventListener('change', addBackgroundImage);
moveBgBtn.addEventListener('click', setMoveBgOption);
colorPicker.addEventListener('input', setColor);
bgColorPicker.addEventListener('input', setBgColor);
clearCanvasBtn.addEventListener('click', clearCanvas);
addRectBtn.addEventListener('click', addRectangle);
addCircleBtn.addEventListener('click', addCircle);
addTextBtn.addEventListener('click', addText);
deleteBtn.addEventListener('click', deleteObject);
saveBtn.addEventListener('click', saveToJson);
loadFromStorageBtn.addEventListener('click', restoreFromLocalStorage);
exportBtn.addEventListener('click', exportToImage);
widthInput.addEventListener('change', setWidth);
heightInput.addEventListener('change', setHeight);
centerBtn.addEventListener('click', centerObj);
moveBackBtn.addEventListener('click', moveBack);
moveFrontBtn.addEventListener('click', moveFront);
lockMovementBtn.addEventListener('click', lockObject);
fontSizeSelect.addEventListener('change', setFontSize);
fontFamilySelect.addEventListener('change', setFontFamily);
canvas.requestRenderAll();

const backgroundImagePanningEvents = () => {
  canvas.on('mouse:move', (event) => {
    if (state.mousePressed && state.currentMode === modes.pan) {
      canvas.setCursor('grab');
      canvas.selection = false;
      canvas.requestRenderAll();
      const mEvent = event.e;
      const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
      canvas.relativePan(delta);
    }
  });

  canvas.on('mouse:down', (event) => {
    state.mousePressed = true;
    if (state.currentMode === modes.pan) {
      canvas.setCursor('grab');
      canvas.requestRenderAll();
    }
  });

  canvas.on('mouse:up', (event) => {
    state.mousePressed = false;
    canvas.selection = true;
    canvas.setCursor('default');
    canvas.requestRenderAll();
  });
};

// canvas.on('selection:created', getCurrentActiveObj);
// canvas.on('selection:updated', getCurrentActiveObj);

backgroundImagePanningEvents();
