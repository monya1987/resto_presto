// @flow

export const playNotifySound = () => {
  let audio = new Audio('/sound/notify-sound.mp3');
  const promise = audio.play();
  if (promise) {
    //Older browsers may not return a promise, according to the MDN website
    promise.catch(function(error: {}) { console.log(error)});
  }
};