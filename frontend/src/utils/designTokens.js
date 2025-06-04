export const designTokens = {
    colors: {
      navyBlue: '#1e3a8a',
      teal: '#06b6d4',
      blue: '#3b82f6',
      darkTeal: '#0891b2',
      lightGray: '#e5e7eb',
      white: '#ffffff',
      error: '#f87171',
      errorBg: 'rgba(239, 68, 68, 0.1)',
      success: '#22c55e',
      successBg: 'rgba(34, 197, 94, 0.1)',
      glassBg: 'rgba(255, 255, 255, 0.1)',
      glassBorder: 'rgba(255, 255, 255, 0.18)',
      inputBorder: 'rgba(255, 255, 255, 0.3)',
      inputLabel: 'rgba(255, 255, 255, 0.7)',
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontSize: '2rem',
        fontWeight: 700,
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
      },
    },
    animations: {
      gradientShift: `
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `,
    },
  };