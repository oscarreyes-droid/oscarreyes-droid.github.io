// Portfolio content — update your information here.
window.PORTFOLIO = {
  "theme": "clean",
  "showThemePicker": false,
  "name": "Oscar Reyes",
  "initials": "OR",
  "photo": "",
  "headline": "Bringing circuits to life with FIRMWARE",
  "tagline": "",
  "school": "Electrical & Computer Engineering · UT Austin · May 2027",
  "location": "Austin, TX",
  "status": "Aspiring firmware engineer · Embedded systems · Computer architecture",
  "about": "My goal is to write firmware that brings hardware to life. I’m an Electrical and Computer Engineering student at UT Austin, building real-time kernels and microcontroller applications in C and ARM assembly. My work in computer architecture and security operations shapes how I think about reliable systems.",
  "email": "oscarreyes@utexas.edu",
  "resume": "resume.pdf",
  "links": [
    {
      "label": "LinkedIn",
      "url": "https://www.linkedin.com/in/oscarreyes19/"
    },
    {
      "label": "GitHub",
      "url": "https://github.com/oscarreyes-droid"
    }
  ],
  "experience": [
    {
      "role": "Security Operations Center Analyst",
      "org": "UT Regional Security Operations Center",
      "place": "Austin, TX",
      "dates": "June 2025 – Present",
      "summary": "Performed 30+ security triages using Splunk SIEM logs to investigate threats and suspicious activity. Use CLI tools and Python scripts to identify indicators of compromise and support remediation, alongside web application and network vulnerability assessments.",
      "tags": [
        "Splunk",
        "Python",
        "Incident response"
      ],
      "logo": "rsoc.jpg"
    },
    {
      "role": "Academic Mentor",
      "org": "UT Austin · Ramshorn Scholars Program",
      "place": "Austin, TX",
      "dates": "April 2025 – April 2026",
      "summary": "Mentored four students through academic support, tutoring, and guidance. Participated in training and shared weekly feedback to help improve a program serving 100+ scholars.",
      "tags": [
        "Mentorship",
        "Communication"
      ],
      "logo": "texas.jpg"
    },
    {
      "role": "Undergraduate Tutor",
      "org": "The University of Texas at Austin",
      "place": "Austin, TX",
      "dates": "October 2024 – May 2025",
      "summary": "Guided 75+ students through digital logic, microarchitecture encoding, and computer architecture. Hosted exam review sessions for ECE 306.",
      "tags": [
        "Computer architecture",
        "Teaching"
      ],
      "logo": "texas.jpg"
    }
  ],
  "projects": [
    {
      "name": "RTOS Kernel & Autonomous Racing Robot",
      "when": "Spring 2026 · Team project",
      "stack": [
        "C",
        "ARM Assembly",
        "MSPM0G3507",
        "RTOS",
        "CAN",
        "PID control"
      ],
      "summary": "Developed the real-time kernel used in a team-built autonomous racing robot. Priority-based scheduling, synchronization, and critical-section control supported a system built around two MSPM0G3507 microcontrollers.",
      "result": "Profiled kernel timing with GPIO measurements. Team robot measurements: approximately 45 cm/s speed and ±7° turning accuracy on a 90° turn.",
      "url": "",
      "category": "Firmware / RTOS / Robotics",
      "id": "rtos-kernel",
      "details": [
        "Used IR and TF-Luna distance sensors, with measurements shared between the two microcontrollers over CAN for real-time steering and motor control.",
        "Combined PWM motor and servo control with soft-start ramping, bumper-triggered recovery, and Wi-Fi race start/stop commands."
      ],
      "images": [
        {
          "src": "robotorthog.jpg",
          "alt": "Side view of the autonomous racing robot, showing stacked microcontroller boards, wiring, wheels, and steering hardware.",
          "caption": "The team-built racing robot, with its stacked control boards and steering hardware."
        },
        {
          "src": "robottopdown.jpg",
          "alt": "Top-down view of the racing robot with two MSPM0G3507 boards and distance sensors around the chassis.",
          "caption": "Top-down view of the two-microcontroller platform and distance-sensor layout."
        }
      ]
    },
    {
      "name": "LC-3b Processor & Simulator",
      "when": "Fall 2025",
      "stack": [
        "C",
        "Computer architecture"
      ],
      "summary": "Designed a two-pass assembler and instruction-level simulator supporting 25+ ISA instructions. Built cycle-level microarchitecture and five-stage pipeline simulators.",
      "result": "Implemented microcode, interrupts, address translation, caches, dependency detection, and stalls.",
      "url": "",
      "category": "Architecture / Simulation",
      "id": "lc3b-processor"
    },
    {
      "name": "Multirate FIR Filter Bank",
      "when": "Fall 2025 · Team project",
      "stack": [
        "MATLAB",
        "DSP",
        "Wavelets"
      ],
      "summary": "Extended a course-provided filter bank into a four-level analysis and synthesis pipeline, separating audio into five frequency bands and reconstructing the signal.",
      "result": "Explored subband reconstruction and signal-fidelity tradeoffs with Carlos Rojas and Emmanuel Ramirez.",
      "url": "documents/fir-filter-bank.pdf",
      "category": "Signals / Audio",
      "id": "fir-filter-bank",
      "images": [
        {
          "src": "images/signals/fir-filter-responses.png",
          "alt": "MATLAB magnitude-response plot with complementary blue lowpass and red highpass filter curves.",
          "caption": "Lowpass and highpass analysis filters split the signal by frequency. From the team report, page 5."
        },
        {
          "src": "images/signals/fir-octave-spectrogram.png",
          "alt": "Blue and yellow spectrogram titled 3-line Octave Branch, with frequency plotted against time and a power-density color scale.",
          "caption": "An octave-branch spectrogram visualizes how signal energy changes over time. From the team report, page 7."
        }
      ]
    },
    {
      "name": "Space Invaders on a Microcontroller",
      "when": "Fall 2024",
      "stack": [
        "C",
        "ARM Assembly",
        "Embedded systems"
      ],
      "summary": "Built a real-time game with collision detection, enemy movement, score keeping, and multi-sprite rendering on the MSPM0G3507.",
      "result": "Integrated a 12-bit DAC for audio, an ADC-driven slide potentiometer, and a TFT LCD.",
      "url": "",
      "category": "Firmware / Interactive",
      "id": "space-invaders"
    },
    {
      "name": "Programmable Stopwatch & Timer",
      "when": "Spring 2025 · Team project",
      "stack": [
        "Verilog",
        "Basys3 FPGA",
        "Digital logic"
      ],
      "summary": "Designed a custom datapath and finite-state controller supporting four watch and timer modes, with live I/O and seven-segment displays.",
      "result": "Developed with Zoe Gonzalez. Verified timing and mode switching through simulation and hardware testing.",
      "url": "",
      "category": "Digital logic / FPGA",
      "id": "fpga-timer",
      "demo": "basys3"
    },
    {
      "name": "Audio ↔ Image Signal Synthesis",
      "when": "Fall 2025 · Team project",
      "stack": [
        "MATLAB",
        "FFT",
        "Signal processing"
      ],
      "summary": "Converted 28 seconds of mono audio into a time-frequency image using FFT analysis, companding, and RGB encoding, then reconstructed audio from the image.",
      "result": "Compared reconstruction fidelity and quantization effects with Carlos Rojas and Emmanuel Ramirez.",
      "url": "documents/audio-image-synthesis.pdf",
      "category": "Signals / Representation",
      "id": "audio-image-synthesis",
      "images": [
        {
          "src": "images/signals/audio-encoded-image.png",
          "alt": "RGB image encoding the real and imaginary components of the audio signal’s short-time Fourier transform.",
          "caption": "Sound represented as pixels: companded Fourier coefficients encoded into an RGB image. From the team report, page 5."
        },
        {
          "src": "images/signals/audio-reconstruction.png",
          "alt": "Overlaid waveform plot comparing original audio in blue with audio reconstructed from its image representation in dashed red.",
          "caption": "Original versus reconstructed audio over 28 seconds, showing the effect of the image round trip. From the team report, page 7."
        }
      ]
    }
  ],
  "skills": [
    {
      "group": "Languages",
      "items": [
        "C",
        "C++",
        "ARM Assembly",
        "Verilog",
        "Python",
        "Java",
        "SQL",
        "JavaScript",
        "HTML / CSS"
      ]
    },
    {
      "group": "Hardware & systems",
      "items": [
        "MSPM0G3507",
        "Basys3 FPGA",
        "UART",
        "I2C",
        "SPI",
        "MATLAB",
        "Docker"
      ]
    },
    {
      "group": "Security & software",
      "items": [
        "Splunk",
        "Wireshark",
        "Nmap",
        "Burp Suite",
        "Metasploit",
        "React"
      ]
    }
  ],
  "awards": [
    "Engineering Honors",
    "University Honors",
    "HSF Scholar",
    "Ramshorn Scholar",
    "T.W. Whaley, Jr. Friends of Alec Endowed Scholar"
  ]
};
