export function JiraStringMethod(e) {
    // const re = /^[0-9a-zA-Z\b]+$/;
    // if (!re.test(e.key)) {
    //   e.preventDefault();
    // }
    if (e.key === ' ') {
        e.preventDefault(); // Block spaces explicitly
      }
  }

  export function StringMethod(e) {
      const re = /^[0-9\b\-]+$/;
      if (!re.test(e.key)) {
        e.preventDefault();
      }
    }
    
    export function validateNumberMethod(e) {
      const re = /^[,.0-9\b]+$/;
      if (!re.test(e.key)) {
        e.preventDefault();
      }
    }
    export function dragonClaimIdStringMethod(e) {
      const re = /^[,0-9\b]+$/;
      if (!re.test(e.key)) {
        e.preventDefault();
      }
    }
  
    export function diagsStringMethod(e) {
      const re = /^[A-Za-z0-9.,]+$/;
      if (!re.test(e.key)) {
        e.preventDefault();
      }
    }
    