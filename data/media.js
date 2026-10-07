// Images & videos for each case study. Keys match project slugs.
// Item types:
//   {type:"image", src:"assets/folder/x.png", caption:"..."}
//   {type:"video", src:"assets/folder/x.mp4", caption:"..."}   (mp4/webm)
//   {type:"embed", src:"https://www.youtube.com/embed/ID", caption:"..."}  (YouTube / Vimeo / Figma embed URL)
// Leave things empty to show dashed "add here" slots on the page.

const MEDIA={
  "crystal-consciousness":{
    installation:[
      {type:"video",src:"assets/crystal/installation.mp4",caption:"A visitor being fitted with sensors while the cave responds."},
      {type:"video",src:"assets/crystal/cave-portrait.mp4",caption:"Inside the cave."}
    ],
    signals:[
      {type:"video",src:"assets/crystal/eeg-demo.mp4",caption:"Sensor demo: placing the EEG electrodes on a visitor."},
      {type:"video",src:"assets/crystal/audio-visual.mp4",caption:"Audio-visual close-up: the virtual Eurorack and the nerve cell projection."},
      {type:"image",src:"assets/crystal/eeg.jpg",caption:"EEG electrodes on the forehead."}
    ],
    build:[
      {type:"image",src:"assets/crystal/purple.jpg",caption:"The projected nerve cell, with hanging 3D-printed crystals."},
      {type:"image",src:"assets/crystal/crystal.jpg",caption:"A 3D-printed crystal lit by the projection."},
      {type:"image",src:"assets/crystal/room.jpg",caption:"The cave in the dark."},
      {type:"image",src:"assets/crystal/crowd.jpg",caption:"A small audience gathers around each session."}
    ]
  },

  // Siemens: three flows, each with Original vs Design suggestion + optional prototype walkthroughs.
  // Siemens: screenshots and videos intentionally not shown (cannot be shared publicly).
  siemens:{},
  "crystal-consciousness":{
    installation:[
      {type:"video",src:"assets/crystal/installation.mp4",caption:"A visitor being fitted with sensors while the cave responds."},
      {type:"video",src:"assets/crystal/cave-portrait.mp4",caption:"Inside the cave."}
    ],
    signals:[
      {type:"video",src:"assets/crystal/eeg-demo.mp4",caption:"Sensor demo: placing the EEG electrodes on a visitor."},
      {type:"video",src:"assets/crystal/audio-visual.mp4",caption:"Audio-visual close-up: the virtual Eurorack and the nerve cell projection."},
      {type:"image",src:"assets/crystal/eeg.jpg",caption:"EEG electrodes on the forehead."}
    ],
    build:[
      {type:"image",src:"assets/crystal/purple.jpg",caption:"The projected nerve cell, with hanging 3D-printed crystals."},
      {type:"image",src:"assets/crystal/crystal.jpg",caption:"A 3D-printed crystal lit by the projection."},
      {type:"image",src:"assets/crystal/room.jpg",caption:"The cave in the dark."},
      {type:"image",src:"assets/crystal/crowd.jpg",caption:"A small audience gathers around each session."}
    ]
  },

  // Siemens: three flows, each with Original vs Design suggestion + optional prototype walkthroughs.
  siemens:{
    sourcing:{ // Sourcing timeline
      before:{type:"image",src:"assets/siemens/sourcing-original.png",caption:"Original Sourcing"},
      after:{type:"image",src:"assets/siemens/sourcing-after.png",caption:"Suggested Sourcing design"},
      flow:[]
    },
    bom:{      // BOM Upload flow
      before:{type:"image",src:"assets/siemens/bom-upload-original.png",caption:"Original BOM Upload flow"},
      after:{type:"video",src:"assets/siemens/bom-upload-after.mp4",caption:"Suggested BOM Upload flow"},
      flow:[]        // extra images/videos, e.g. a prototype screen recording
    },
    search:{   // Parametric Search (landing page + loading state)
      before:{type:"image",src:"assets/siemens/parametric-search-before.jpg",caption:"Original Parametric Search"},
      after:{type:"video",src:"assets/siemens/parametric-search-after.mp4",caption:"Suggested Parametric Search design"},
      flow:[]
    },
    results:{  // Parametric Search results table
      before:{type:"image",src:"assets/siemens/parametric-search-results-original.png",caption:"Original Parametric Search results"},
      after:{type:"video",src:"assets/siemens/parametric-search-results-after.mp4",caption:"Suggested Parametric Search results design"},
      flow:[]
    },
    matches:{  // Parametric Matches
      before:{type:"image",src:"assets/siemens/parametric-matches-original.png",caption:"Original Parametric Matches"},
      after:{type:"image",src:"assets/siemens/parametric-matches-after.png",caption:"Suggested Parametric Matches design"}, flow:[]
    }
  },
  // Other case studies: a simple list shown in a "Prototypes" section.
  "nvidia-ucsc":[]
};
