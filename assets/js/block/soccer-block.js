function startCountdown(block, gameDate) {
    if (block.dataset.countdownId) return;

    const timeElement = block.querySelector('.game-time-counter');
    if (!timeElement) return;

    const futureDate = new Date(gameDate);

    const countdownId = setInterval(() => {
        const now = new Date();
        const diff = futureDate - now;

        if (diff <= 0) {
            clearInterval(countdownId);
            delete block.dataset.countdownId;
            updateMatchData(block);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) {
            timeElement.innerText = `${days}d ${hours}h ${minutes}m`;
        } else {
            timeElement.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }, 1000);

    block.dataset.countdownId = countdownId;
}

function updateMatchData(block) {
    const teamId = block.getAttribute('data-team-id');
    const soccerBlockUrl = GProdemiSettings?.soccerBlockUrl;
    const pageLang = document.documentElement.lang || 'en';
    const userLang = navigator.language || 'en-US';
    const systemLang = (GProdemiSettings?.idioma || 'en').replace('_', '-');
    let finalLang;
    if (userLang.toLowerCase().startsWith(pageLang.toLowerCase())) {
        finalLang = userLang;
    } else if (systemLang.toLowerCase().startsWith(pageLang.toLowerCase())) {
        finalLang = systemLang;
    } else {
        finalLang = pageLang;
    }
    finalLang = finalLang
        .split('-')
        .map((part, index) =>
            index === 0 ? part.toLowerCase() : part.toUpperCase()
        )
        .join('-').replace('_', '-').toLowerCase();

    fetch(`${soccerBlockUrl}/match?team=${teamId}&lang=${finalLang}`)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.id) {
                block.style.display = 'none';
                return;
            }

            const dataTeam = data;
            const isInitialized = block.dataset.initialized === "true";
            const newHomeScore = data.score?.home ?? '';
            const newAwayScore = data.score?.away ?? '';

            if (isInitialized) {
                const oldHome = parseInt(block.dataset.homeScore, 10) || 0;
                const oldAway = parseInt(block.dataset.awayScore, 10) || 0;

                const newHome = parseInt(newHomeScore, 10) || 0;
                const newAway = parseInt(newAwayScore, 10) || 0;

                const didHomeScore = newHome > oldHome;
                const didAwayScore = newAway > oldAway;
                const goalText = dataTeam.status.goal;

                if ((didHomeScore || didAwayScore) && goalText) {

                    const goalElement = block.querySelector('.soccer-block-goal-notification');
                    if (goalElement) {
                        goalElement.innerText = goalText;
                        goalElement.classList.add('visible');

                        setTimeout(() => {
                            goalElement.innerText = '';
                            goalElement.classList.remove('visible');
                        }, 10000);
                    }

                    const scoreContainer = block.querySelector('.soccer-block-score-content');
                    if (scoreContainer) {
                        scoreContainer.classList.add('goal-animation');

                        setTimeout(() => {
                            scoreContainer.classList.remove('goal-animation');
                        }, 10000);
                    }
                }
            }

            block.dataset.homeScore = newHomeScore;
            block.dataset.awayScore = newAwayScore;

            if (!isInitialized) {
                block.innerHTML = `
                <div class="soccer-block-score-header">
                    ${dataTeam?.live
                        ? `<span class="soccer-block-score-live">Live</span>`
                        : `<span class="soccer-block-score-date">
                            ${new Date(dataTeam.date).toLocaleDateString()} 
                            ${new Date(dataTeam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>`
                    }
                </div>
                <div class="soccer-block-team">
                    <div class="soccer-block-team-img">
                        <img src="${dataTeam?.teams?.home?.logo}" alt="${dataTeam?.teams?.home?.name}">
                    </div>
                    <p>${dataTeam?.teams?.home?.name}</p>
                </div>
                <div class="soccer-block-score">
                    
                    <div class="soccer-block-score-content">
                        <div class="soccer-block-score-content-scoreboard">${newHomeScore}</div>
                        
                        <div class="soccer-block-score-content-time game-time-counter"> 
                            ${dataTeam?.status?.elapsed
                        ? `${dataTeam.status.elapsed}${dataTeam?.status?.extra ? `+${dataTeam?.status?.extra}` : ''}’`
                        : `${dataTeam?.status?.long || ''}`
                    }
                        </div>

                        <div class="soccer-block-score-content-scoreboard">${newAwayScore}</div>
                    </div>
                </div>
                <div class="soccer-block-team">
                    <div class="soccer-block-team-img">
                        <img src="${dataTeam?.teams?.away?.logo}" alt="${dataTeam?.teams?.away?.name}">
                    </div>
                    <p>${dataTeam?.teams?.away?.name}</p>
                </div>
                <span class="soccer-block-goal-notification"></span>`;
                block.dataset.initialized = "true";
                block.style.display = 'flex';
            } else {
                const scoreElements = block.querySelectorAll('.soccer-block-score-content-scoreboard');
                if (scoreElements.length === 2) {
                    scoreElements[0].innerText = newHomeScore;
                    scoreElements[1].innerText = newAwayScore;
                }

                const timeElement = block.querySelector('.game-time-counter');
                if (timeElement) {
                    if (!block.dataset.countdownId) {
                        timeElement.innerText = dataTeam?.status?.elapsed
                            ? `${dataTeam.status.elapsed}${dataTeam?.status?.extra ? `+${dataTeam?.status?.extra}` : ''}’`
                            : `${dataTeam?.status?.long || ''}`;
                    }
                }

                const date = block.querySelector('.soccer-block-score-header');
                if (date) {
                    date.innerHTML = dataTeam?.live
                        ? `<span class="soccer-block-score-live">Live</span>`
                        : `<span class="soccer-block-score-date">
                            ${new Date(dataTeam.date).toLocaleDateString()} 
                            ${new Date(dataTeam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>`
                }
            }

            const status = data.status?.short;

            if (status !== 'NS' && status !== 'TBD' && block.dataset.countdownId) {
                clearInterval(parseInt(block.dataset.countdownId, 10));
                delete block.dataset.countdownId;
            }

            if (status === 'NS' || status === 'TBD') {
                startCountdown(block, data.date);
            }

            if (['FT', 'HT', 'PST', 'CANC'].includes(status)) {
                const timeElement = block.querySelector('.game-time-counter');
                if (timeElement && !block.dataset.countdownId) {
                    timeElement.innerText = dataTeam?.status?.long || '';
                }
            }

            let nextPollInterval = 30000;

            if (['FT', 'AET', 'PEN', 'CANC', 'PST'].includes(status)) {
                return;
            } else if (status === 'NS' || status === 'TBD') {
                const timeToAction = new Date(data.date) - new Date();
                if (timeToAction < 5 * 60 * 1000) {
                    nextPollInterval = 20000;
                } else {
                    nextPollInterval = 5 * 60 * 1000;
                }
            }

            setTimeout(() => updateMatchData(block), nextPollInterval);
        })
        .catch(err => {
            console.error(err);
            setTimeout(() => updateMatchData(block), 60000);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const soccerBlocks = document.querySelectorAll('.soccer-block');

    soccerBlocks.forEach(block => {
        block.style.display = 'none';
        updateMatchData(block);
    });
});