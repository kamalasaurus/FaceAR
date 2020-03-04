import clm from './clmtrackr.module.js';

void function() {

  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const ctracker = new clm.tracker();


  function drawLip(points) {
    context.beginPath();
    points.forEach((point, i) => {
      if (i === 0) context.moveTo(...point);
      else context.lineTo(...point);
    });
    context.closePath();
    context.fill();
  }

  const like = '#CE365D'; // rgba(206, 54, 93, 0.5)
  const zip = '#ED1C24';

  const like2 = 'rgba(206, 54, 93, 0.5)';
  const zip2 = 'rgba(237, 28, 36, 0.2)';

  function drawLoop() {
    requestAnimationFrame(drawLoop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = zip2;

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

  const constraints = window.constraints = {
    audio: false,
    video: true
  };

  function handleSucontextess(stream) {
    video.srcObject = stream;

    setTimeout(() => {

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctracker.init();
      ctracker.start(video);

      drawLoop();

    }, 1000);
  }

  function handleError(error) {
    switch (error.name) {
      case 'ConstraintNotSatisfiedError':
        const v = constraints.video;
        console.error(`The resolution of ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
      case 'PermissionDeniedError':
        console.error(`Permissions have not been granted to use your camera and microphone, you need to allow the
        page acontextess to your devices.`);
      default:
        console.error(`getUserMedia error: ${error.name}`);
    }
  }

  function init(e) {
    e.target.disabled = true;
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSucontextess)
      .catch(handleError)
  }

  document
    .querySelector('#show')
    .addEventListener('click', init);

}();
