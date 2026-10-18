// Portfolio content — update your information here.
window.PORTFOLIO = {
  "theme": "clean",
  "showThemePicker": false,
  "name": "Oscar Reyes",
  "initials": "OR",
  "photo": "",
  "headline": "From code to circuits.",
  "tagline": "Building firmware, real-time systems, and a deeper understanding of the hardware underneath.",
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
      ]
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
      ]
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
      ]
    }
  ],
  "projects": [
    {
      "name": "Real-Time Operating System Kernel",
      "when": "Spring 2026",
      "stack": [
        "C",
        "ARM Assembly",
        "MSPM0G3507"
      ],
      "summary": "Built a real-time kernel with priority-based scheduling, thread synchronization, and critical-section control for shared resources.",
      "result": "Validated timing with GPIO profiling of context-switch overhead, latency, and jitter.",
      "url": "",
      "category": "Firmware / Real-time",
      "id": "rtos-kernel"
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
      "id": "fir-filter-bank"
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
      "when": "Spring 2025",
      "stack": [
        "Verilog",
        "Basys3 FPGA",
        "Digital logic"
      ],
      "summary": "Designed a custom datapath and finite-state controller supporting four watch and timer modes, with live I/O and seven-segment displays.",
      "result": "Verified timing and mode switching through simulation and hardware testing.",
      "url": "",
      "category": "Digital logic / FPGA",
      "id": "fpga-timer"
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
      "id": "audio-image-synthesis"
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
