const translations = {
  english: {
    // existing keys
    welcomeBack: "Welcome back",
    highScore: "High Score",
    gamesPlayed: "Games Played",
    playGame: "Play Game",
    howToPlay: "How to Play",
    menu: "Menu",
    english: "English",
    portuguese: "Português",
    selectLanguage: "Select Language",
    cancel: "Cancel",

    // from AuthDialogs
    createAccount: "Create Account",
    signIn: "Sign In",
    displayName: "Display Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    createAccountCta: "Create Account",
    signInCta: "Sign In",
    gotIt: "Got it!",
    objective: "Objective",
    gameplay: "Gameplay",
    competition: "Competition",
    findWordsIn3Min: "Find as many words as possible in 3 minutes",
    scorePointsByLengthAndBoard:
      "Score points based on word length and board number",
    swipeToConnectAdjacent:
      "Swipe to connect adjacent letters (including diagonals)",
    wordsAtLeast3: "Words must be at least 3 letters long",
    eachLetterOnce: "Each letter can only be used once per word",
    longerWordsMorePoints: "Longer words score more points",
    competeMonthlyHighestScore: "Compete monthly for the highest score",
    monthlyWinnersEarnStar: "Monthly winners earn a star",
    trackProgressLeaderboard: "Track your progress on the leaderboard",
    gamePaused: "Game Paused",
    whatWouldYouLikeToDo: "What would you like to do?",
    restartGame: "Restart Game",
    backToMainMenu: "Back to Main Menu",
    resumeGame: "Resume Game",

    // (ScoringInfoModal)
    scoringSystem: "Scoring System",
    scoringSubtitle:
      "Points vary by word length and board number. Find longer words on earlier boards for maximum points!",
    boardLabel: "Board",
    letters: "Letters",
    current: "Current",
    points: "points",
    scoringTips: "Scoring Tips",
    tip1: "Longer words = More points - 8+ letter words give the highest scores",
    tip2: "Earlier boards = Higher multipliers - Board 1 gives maximum points",
    tip3: "Strategic play - Find long words early, or clear short words to progress",
    tip4: "Bonus words - Special words still give 300 points regardless of board",
    close: "Got it!",

    // (GameHeader)
    score: "Score",
    time: "Time",
    board: "Board",
    minute: "minute",
    minutes: "minutes",
    second: "second",
    seconds: "seconds",

    // new (GameControls)
    newBoard: "New Board",
    gameMenu: "Game Menu",
  },

  portuguese: {
    // existing keys
    welcomeBack: "Bem-vindo de volta",
    highScore: "Recorde",
    gamesPlayed: "Partidas jogadas",
    playGame: "Jogar",
    howToPlay: "Como jogar",
    menu: "Menu",
    english: "English",
    portuguese: "Português",
    selectLanguage: "Selecionar idioma",
    cancel: "Cancelar",

    // from AuthDialogs
    createAccount: "Criar conta",
    signIn: "Entrar",
    displayName: "Nome de exibição",
    email: "E-mail",
    password: "Senha",
    confirmPassword: "Confirmar senha",
    createAccountCta: "Criar conta",
    signInCta: "Entrar",
    gotIt: "Entendi!",
    objective: "Objetivo",
    gameplay: "Jogabilidade",
    competition: "Competição",
    findWordsIn3Min: "Encontre o máximo de palavras possível em 3 minutos",
    scorePointsByLengthAndBoard:
      "Pontue de acordo com o tamanho da palavra e o número do tabuleiro",
    swipeToConnectAdjacent:
      "Deslize para conectar letras adjacentes (incluindo diagonais)",
    wordsAtLeast3: "As palavras devem ter pelo menos 3 letras",
    eachLetterOnce: "Cada letra só pode ser usada uma vez por palavra",
    longerWordsMorePoints: "Palavras mais longas valem mais pontos",
    competeMonthlyHighestScore: "Compita mensalmente pela maior pontuação",
    monthlyWinnersEarnStar: "Os vencedores do mês ganham uma estrela ⭐",
    trackProgressLeaderboard: "Acompanhe seu progresso no ranking",
    gamePaused: "Jogo pausado",
    whatWouldYouLikeToDo: "O que você gostaria de fazer?",
    restartGame: "Reiniciar jogo",
    backToMainMenu: "Voltar ao menu principal",
    resumeGame: "Retomar jogo",

    // (ScoringInfoModal)
    scoringSystem: "Sistema de pontuação",
    scoringSubtitle:
      "Os pontos variam conforme o tamanho da palavra e o número do tabuleiro. Encontre palavras mais longas nos primeiros tabuleiros para obter o máximo de pontos!",
    boardLabel: "Tabuleiro",
    letters: "Letras",
    current: "Atual",
    points: "pontos",
    scoringTips: "Dicas de pontuação",
    tip1: "Palavras mais longas = Mais pontos — palavras com 8+ letras dão as maiores pontuações",
    tip2: "Tabuleiros iniciais = Multiplicadores maiores — o Tabuleiro 1 dá o máximo de pontos",
    tip3: "Jogo estratégico — encontre palavras longas cedo ou limpe palavras curtas para avançar",
    tip4: "Palavras bônus — palavras especiais sempre valem 300 pontos, independentemente do tabuleiro",
    close: "Entendi!",

    // (GameHeader)
    score: "Pontuação",
    time: "Tempo",
    board: "Tabuleiro",
    minute: "minuto",
    minutes: "minutos",
    second: "segundo",
    seconds: "segundos",

    // new (GameControls)
    newBoard: "Novo tabuleiro",
    gameMenu: "Menu do jogo",
  },
};

export const getTranslation = (key, language = "english") => {
  return translations[language]?.[key] || translations.english[key] || key;
};

export const getPluralizedTime = (language, value, unit) => {
  const lang = translations[language] || translations.english;
  if (value === 1) {
    return `${value} ${lang[unit]}`;
  } else {
    return `${value} ${lang[`${unit}s`]}`;
  }
};
