import clm from './clmtrackr.module.js';

void function() {

  const videoInput = document.getElementById('video');
  const canvasInput = document.getElementById('canvas');

  const ctracker = new clm.tracker();

  const cc = canvasInput.getContext('2d');

  function drawLip(points) {
    cc.beginPath();
    points.forEach((point, i) => {
      if (i === 0) cc.moveTo(...point);
      else cc.lineTo(...point);
    });
    cc.closePath();
    cc.fill();
  }

  const like = '#CE365D'; // rgba(206, 54, 93, 0.5)
  const zip = '#ED1C24';

  const like2 = 'rgba(206, 54, 93, 0.5)';
  const zip2 = 'rgba(237, 28, 36, 0.2)';

  function drawLoop() {
    requestAnimationFrame(drawLoop);
    cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
    //cc.fillStyle = '#FF0000';
    cc.fillStyle = zip2;

    const position = ctracker.getCurrentPosition();
    const upper_lip = []
      .concat(position.slice(44, 51))
      .concat(position.slice(59, 62));

    const lower_lip = []
      .concat(position.slice(44,45))
      .concat(position.slice(56, 59))
      .concat(position.slice(50, 56));

    drawLip(upper_lip);
    drawLip(lower_lip);
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

  function init(e) {
    e.target.disabled = true;
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch(handleError)
  }

  document
    .querySelector('#show')
    .addEventListener('click', init);

}();
