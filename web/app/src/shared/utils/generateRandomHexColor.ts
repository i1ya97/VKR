const standartColors = [
    '4791FF',
    'FF9800',
    'EB5757',
    '7270FF',
    '31A465',
    '008BA3',
    'B61256',
    'FF80B4',
    '113974',
    'BC1414',
  ];
  
  export const generateRandomHexColor = (index?: number) => {
    if (index !== undefined && index < standartColors.length) {
      return standartColors[index];
    } else {
      const letters = '0123456789ABCDEF';
      let color = '';
  
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
  
      return color;
    }
  };