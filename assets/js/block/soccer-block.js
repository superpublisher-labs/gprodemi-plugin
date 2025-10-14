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


function startTimer(block, dataTeam) {
    if (block.dataset.timerId) return;

    const timeElement = block.querySelector('.game-time-counter');
    if (!timeElement) return;

    let startTime = null;
    let isSecondHalf = false;

    if (dataTeam.status.short === '1H' && dataTeam.status.periods?.first) {
        startTime = new Date(dataTeam.status.periods.first * 1000);
    } else if (dataTeam.status.short === '2H' && dataTeam.status.periods?.second) {
        startTime = new Date(dataTeam.status.periods.second * 1000);
        isSecondHalf = true;
    }

    if (startTime) {
        const timerId = setInterval(() => {
            const now = new Date();
            const diff = now - startTime;

            let minutes = Math.floor(diff / 60000);
            let seconds = Math.floor((diff % 60000) / 1000);

            if (isSecondHalf) {
                minutes += 45;
            }

            if (minutes > 150) {
                clearInterval(timerId);
                return;
            }

            timeElement.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);

        block.dataset.timerId = timerId;
    }
}


function updateMatchData(block) {
    const teamId = block.getAttribute('data-team-id');
    const langCode = (GProdemiSettings.idioma || 'en').substring(0, 2);
    const soccerBlockUrl = GProdemiSettings.soccerBlockUrl;

    fetch(`${soccerBlockUrl}/match?team=${teamId}`)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.id) {
                block.innerHTML = langCode === 'pt' ? 'Nenhuma partida encontrada' : langCode === 'es' ? 'Ningún partido encontrado' : 'No match found';
                block.style.display = 'flex';
                return;
            }

            const dataTeam = data;
            const isInitialized = block.dataset.initialized === "true";
            const newHomeScore = data.score?.home ?? '';
            const newAwayScore = data.score?.away ?? '';

            if (isInitialized) {
                const oldHomeScore = block.dataset.homeScore;
                const oldAwayScore = block.dataset.awayScore;
                const scoreboardElement = block.querySelector('.soccer-block-score-content-scoreboard');

                if (scoreboardElement && (newHomeScore.toString() !== oldHomeScore || newAwayScore.toString() !== oldAwayScore)) {
                    scoreboardElement.classList.add('goal-animation');
                    setTimeout(() => scoreboardElement.classList.remove('goal-animation'), 10000);

                    const statusTextElement = block.querySelector('.game-status-text');
                    if (statusTextElement) {
                        const originalStatusText = dataTeam?.status?.long[langCode || 'en'] ?? '';
                        statusTextElement.innerText = langCode === 'pt' ? 'Gol!' : langCode === 'es' ? '¡Gol!' : 'Goal!';
                        statusTextElement.classList.add('goal-notification');

                        setTimeout(() => {
                            statusTextElement.innerText = originalStatusText;
                            statusTextElement.classList.remove('goal-notification');
                        }, 6000);
                    }
                }
            }
            block.dataset.homeScore = newHomeScore;
            block.dataset.awayScore = newAwayScore;

            if (!isInitialized) {
                block.innerHTML = `
                    <div class="soccer-block-team">
                        <div class="soccer-block-team-img"><img src="${dataTeam?.teams?.home?.logo}" alt="${dataTeam?.teams?.home?.name} logo"></div>
                        <p>${dataTeam?.teams?.home?.name}</p>
                    </div>
                    <div class="soccer-block-score">
                        <div class="soccer-block-score-header">
                            ${dataTeam?.live ? `<span class="soccer-block-score-live"></span>` :  `<span class="soccer-block-score-date">${new Date(dataTeam.date).toLocaleDateString()} ${new Date(dataTeam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>` }
                            <span class="soccer-block-score-date"></span>
                        </div>
                        <div class="soccer-block-score-content">
                            <p class="soccer-block-score-content-scoreboard">${newHomeScore} - ${newAwayScore}</p>
                            <div class="soccer-block-score-content-time">
                                <p class="game-status-text">${dataTeam?.status?.long[langCode || 'en'] ?? ''}</p>
                                <div class="soccer-block-score-content-time-content">
                                    <p class="game-time-counter"></p>
                                    ${dataTeam?.status?.extra ? `<span class="game-extra-time">+${dataTeam?.status?.extra}'</span>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="soccer-block-team">
                        <div class="soccer-block-team-img"><img src="${dataTeam?.teams?.away?.logo}" alt="${dataTeam?.teams?.away?.name} logo"></div>
                        <p>${dataTeam?.teams?.away?.name}</p>
                    </div>
                `;
                block.dataset.initialized = "true";
                block.style.display = 'flex';
            }

            const statusTextElement = block.querySelector('.game-status-text');
            if (statusTextElement && !statusTextElement.classList.contains('goal-notification')) {
                statusTextElement.innerText = dataTeam?.status?.long[langCode || 'en'] ?? '';
            }

            block.querySelector('.soccer-block-score-content-scoreboard').innerText = `${newHomeScore} - ${newAwayScore}`;

            const extraTimeElement = block.querySelector('.game-extra-time');
            if (extraTimeElement) {
                extraTimeElement.innerText = dataTeam?.status?.extra && (dataTeam?.status?.short === '1H' || dataTeam?.status?.short === '2H' || dataTeam?.status?.short === 'ET') ? `+${dataTeam?.status?.extra}'` : '';
            }

            const liveIndicator = block.querySelector('.soccer-block-score-live');
            const dateIndicator = block.querySelector('.soccer-block-score-date');

            if (liveIndicator && dateIndicator) {
                if (dataTeam?.live) {
                    liveIndicator.innerText = (langCode === 'pt' ? 'Ao vivo' : langCode === 'es' ? 'En vivo' : 'Live');
                    dateIndicator.innerText = '';
                } else {
                    liveIndicator.innerText = '';
                    dateIndicator.innerText = `${new Date(dataTeam.date).toLocaleDateString()} ${new Date(dataTeam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                }
            }

            const status = data.status?.short;

            if (status !== 'NS' && status !== 'TBD' && block.dataset.countdownId) {
                clearInterval(parseInt(block.dataset.countdownId, 10));
                delete block.dataset.countdownId;
            }
            if (['NS', 'TBD', 'FT', 'HT', 'PST', 'CANC'].includes(status) && block.dataset.timerId) {
                clearInterval(parseInt(block.dataset.timerId, 10));
                delete block.dataset.timerId;
            }

            if (status === 'NS' || status === 'TBD') {
                startCountdown(block, data.date);
            } else if (['1H', '2H'].includes(status)) {
                startTimer(block, data);
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