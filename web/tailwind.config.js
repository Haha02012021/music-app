/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{html,js}",
  "./public/index.html"
];
export const theme = {
  extend: {
    backgroundColor: {
      'main-100': '#F2F2F2',
      'main-200': '#E6E6E6',
      'main-300': '#FFFFFF',
      'main-400': '#FFFFFF',
      'main-500': '#9431C6',
      'overlay-30': 'rgba(0, 0, 0, 0.3)',
      'white-30': 'rgba(203, 213, 225, 0.3)',
    },

    keyframes: {
      'slide-right': {
        '0%': {
          '-webkit-transform': 'translateX(-500px);',
                  transform: 'translateX(-500px);'
        },
        '100%': {
          '-webkit-transform': 'translateX(0);',
                  transform: 'translateX(0);'
        }
      },

      'slide-left': {
        '0%': {
          '-webkit-transform': 'translateX(500px);',
                  transform: 'translateX(500px);'
        },
        '100%': {
          '-webkit-transform': 'translateX(0);',
                  transform: 'translateX(0);'
        }
      },

      'slide-left2': {
        '0%': {
          '-webkit-transform': 'translateX(500px);',
                  transform: 'translateX(500px);'
        },
        '100%': {
          '-webkit-transform': 'translateX(0);',
                  transform: 'translateX(0);'
        }
      },

      'scale-up-image': {
        '0%': {
          '-webkit-transform': 'scale(1);',
                  transform: 'scale(1);'
        },
        '100%': {
          '-webkit-transform': 'scale(1.1);',
                  transform: 'scale(1.1);'
        }
      },

      'scale-down-image': {
        '0%': {
          '-webkit-transform': 'scale(1.1);',
                  transform: 'scale(1.1);'
        },
        '100%': {
          '-webkit-transform': 'scale(1);',
                  transform: 'scale(1);'
        }
      },

    },
    
    animation: {
      'slide-right': 'slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
      'slide-left': 'slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
      'slide-left2': 'slide-left2 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
      'scale-up-image': 'scale-up-image 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
      'scale-down-image': 'scale-down-image 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
    },

    flex: {
      '4': '4 4 0%',
      '6': '6 6 0%',
    }
  },
  screens: {
    '1600': '1600px',
  }
};

export const plugins = [];