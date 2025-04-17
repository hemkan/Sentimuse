// import { useState } from "react";

// const Narration = () => {
//   const [narrationBlob, setNarrationBlob] = useState(null);
//   const [input, setInput] = useState("");

//   const hoverNarration = async (voice, poetry) => {
//     try {
//       const response = await fetch("../api/narrationAPI", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           voice,
//           poetry,
//         }),
//       });

//       if (!response.ok) {
//         const responseError = await response.json();
//         throw new Error(responseError.error);
//       }

//       const audio = new Audio();
//       const mediaSource = new MediaSource();
//       audio.src = URL.createObjectURL(mediaSource);

//       const rawAudio = [];

//       mediaSource.addEventListener("sourceopen", async () => {
//         const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");

//         const reader = response.body.getReader();

//         while (true) {
//           const { value, done } = await reader.read();

//           if (value) {
//             if (sourceBuffer.updating) {
//               await new Promise((resolve) => {
//                 sourceBuffer.addEventListener("updateend", resolve, {
//                   once: true,
//                 });
//               });
//             }

//             sourceBuffer.appendBuffer(value);

//             if (audio.paused) {
//               audio.play();
//             }

//             rawAudio.push(value);
//           }

//           if (done) {
//             if (sourceBuffer.updating) {
//               await new Promise((resolve) => {
//                 sourceBuffer.addEventListener("updateend", resolve, {
//                   once: true,
//                 });
//               });
//             }
//             mediaSource.endOfStream();

//             setNarrationBlob(new Blob(rawAudio));
//             break;
//           }
//         }
//       });

//       // audio.play();
//     } catch (error) {
//       console.error("WOMP WOMP. AN ERROR OCCURED: " + error.message || error);
//     }
//   };

//   return (
//     <div>
//       <input
//         value={input}
//         onChange={(e) => {
//           setInput(e.target.value);
//         }}
//       />
//       <button
//         onClick={() => {
//           hoverNarration("NFG5qt843uXKj4pFvR7C", input);
//         }}
//       >
//         Play
//       </button>
//     </div>
//   );
// };

// export default Narration;
