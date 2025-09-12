    const settingsIcon = document.querySelector('.settings');
    const settingsMenu = document.querySelector('.settings-menu');

    settingsIcon.addEventListener('click', () => {
      settingsMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!settingsMenu.contains(e.target) && !settingsIcon.contains(e.target)) {
        settingsMenu.classList.remove('active');
      }
    });