import clm from './clmtrackr.module.js';

void function() {

  const videoInput = document.getElementById('video');
  const canvasInput = document.getElementById('canvas');
  canvasInput.width = 480;
  canvasInput.height = 360;

  const ctracker = new clm.tracker();


  function positionLoop() {
    requestAnimationFrame(positionLoop);
    const positions = ctracker.getCurrentPosition();
    console.log(positions);
    //if (window.salami) setTimeout((function() { debugger; }.bind(positions)),1000)
    // positions = [[x_0, y_0], [x_1,y_1], ... ]
    // do something with the positions ...
  }

  const cc = canvasInput.getContext('2d');
  function drawLoop() {
    requestAnimationFrame(drawLoop);
    cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
    //cc.drawImage(videoInput, 0, 0, canvasInput.width, canvasInput.height);
    ctracker.draw(canvasInput);
  }

  // Put variables in global scope to make them available to the browser console.
  const constraints = window.constraints = {
    audio: false,
    video: true
  };

  function handleSuccess(stream) {
    const video = document.querySelector('video');
    const videoTracks = stream.getVideoTracks();
    console.log('Got stream with constraints:', constraints);
    console.log(`Using video device: ${videoTracks[0].label}`);
    window.stream = stream; // make variable available to browser console

    video.srcObject = stream;

    setTimeout(() => {

      canvasInput.width = video.videoWidth;
      canvasInput.height = video.videoHeight;

      ctracker.init();
      ctracker.start(video);

      drawLoop();
      positionLoop();

    }, 1000);
  }

  function handleError(error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
      const v = constraints.video;
      errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
    } else if (error.name === 'PermissionDeniedError') {
      errorMsg('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.');
    }
    errorMsg(`getUserMedia error: ${error.name}`, error);
  }

  function errorMsg(msg, error) {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }

  async function init(e) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleSuccess(stream);
      e.target.disabled = true;
      window.salami = true;
    } catch (e) {
      handleError(e);
    }
  }

  document.querySelector('#show').addEventListener('click', e => init(e));

}();
