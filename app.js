(() => {
  "use strict";
  const games = [
    {id:"koutack",title:"Koutack",category:"Quebra-cabeça",description:"Empilhe peças coloridas e complete os desafios de cada fase.",emoji:"🟪",bg:"linear-gradient(135deg,#ffe1ec,#ffc1d8)",kind:"external",tag:"Puzzle",gameUrl:"https://play.famobi.com/koutack"},
    {id:"fireboy-watergirl-7",title:"Fireboy & Watergirl 7",category:"Aventura",description:"Explore templos, resolva enigmas e encontre os diamantes.",emoji:"🔥💧",bg:"linear-gradient(135deg,#ffd9cb,#c9eaff)",kind:"external",tag:"Aventura",gameUrl:"https://html5.gamedistribution.com/d4a3629101574bc39bd8f9d1888ca58e/?gd_sdk_referrer_url=https://www.gamedistribution.com/games/fireboy-and-watergirl-7%3A-and-friends/"},
    {id:"traffic",title:"Traffic",category:"Ação",description:"Ajude o personagem a atravessar as ruas no momento certo.",emoji:"🚦",bg:"linear-gradient(135deg,#fff0c4,#ffdb80)",kind:"external",tag:"Reflexos",gameUrl:"https://play.famobi.com/traffic"},
    {id:"ramp",title:"Ramp",category:"Ação",description:"Guie uma bola por plataformas e desvie dos obstáculos.",emoji:"🟣",bg:"linear-gradient(135deg,#dcd7ff,#bcb2ff)",kind:"external",tag:"Desafio",gameUrl:"https://play.famobi.com/ramp"},
    {id:"om-nom-run",title:"Om Nom Run",category:"Aventura",description:"Corra, desvie dos obstáculos e colete moedas.",emoji:"🏃",bg:"linear-gradient(135deg,#d3f2ff,#a6dfff)",kind:"external",tag:"Corrida",gameUrl:"https://play.famobi.com/om-nom-run"},
    {id:"2048",title:"2048",category:"Quebra-cabeça",description:"Combine peças com o mesmo número para chegar a 2048.",emoji:"🔢",bg:"linear-gradient(135deg,#fff4b9,#ffe17a)",kind:"external",tag:"Lógica",gameUrl:"https://play.famobi.com/2048"},
    {id:"crazy-caves",title:"Crazy Caves",category:"Ação",description:"Explore cavernas e colete tesouros neste jogo de ação.",emoji:"⛏️",bg:"linear-gradient(135deg,#d8f7d9,#a8e9b1)",kind:"external",tag:"Ação",gameUrl:"https://play.famobi.com/crazy-caves"},
    {id:"dream-mania",title:"Dream Mania: Happy Match",category:"Quebra-cabeça",description:"Combine peças iguais em uma aventura de combinar três.",emoji:"🧩",bg:"linear-gradient(135deg,#ffe0c8,#ffb99b)",kind:"external",tag:"Puzzle",gameUrl:"https://html5.gamedistribution.com/ff639a87cfdd4eaca9b5f21b97ddd28b/?gd_sdk_referrer_url=https://www.gamedistribution.com/games/dream-mania-happy-match/"},
    {id:"rolling-ball-race",title:"3D Super Rolling Ball Race",category:"Corrida",description:"Controle uma bola em pistas suspensas e cheias de desafios.",emoji:"⚽",bg:"linear-gradient(135deg,#e3e0ff,#b8b0ff)",kind:"external",tag:"3D",gameUrl:"https://html5.gamedistribution.com/c77c8b1ffef242609915d126535b0ca9/?gd_sdk_referrer_url=https://www.gamedistribution.com/games/3d-super-rolling-ball-race/"},
    {id:"tap-block-puzzle",title:"Tap Block Puzzle",category:"Quebra-cabeça",description:"Toque nos blocos da mesma cor para limpar o tabuleiro.",emoji:"🟦",bg:"linear-gradient(135deg,#d8f4ff,#a8dcf5)",kind:"external",tag:"Puzzle",gameUrl:"https://html5.gamedistribution.com/70d6750398804d318190af8234eaa955/?gd_sdk_referrer_url=https://www.gamedistribution.com/games/tap-block-puzzle%3A-smash-game/"}
  ];
  const $ = id => document.getElementById(id);
  const catalog = $("catalogView"), screen = $("gameScreen"), grid = $("gameGrid");
  let activeCategory="Todos", query="", currentGame=null, gameCleanup=null, recent=[];
  const categories=["Todos","Ação","Aventura","Corrida","Quebra-cabeça","Lógica"];
  function renderFilters(){
    $("categoryFilters").innerHTML=categories.map(c=>`<button class="filter-chip ${c===activeCategory?"active":""}" data-category="${c}">${c}</button>`).join("");
  }
  function filteredGames(){
    return games.filter(g=>(activeCategory==="Todos"||g.category===activeCategory)&&(`${g.title} ${g.description} ${g.category}`).toLowerCase().includes(query.toLowerCase()));
  }
  function renderGames(){
    const list=filteredGames();
    $("shelfTitle").textContent=query?`Resultados para "${query}"`:activeCategory==="Todos"?"Todos os jogos":activeCategory;
    $("gameCount").textContent=`${list.length} ${list.length===1?"jogo":"jogos"}`;
    grid.innerHTML=list.map(g=>`<article class="game-card" tabindex="0" role="button" aria-label="Jogar ${g.title}" data-game="${g.id}">
      <div class="game-art" style="background:${g.bg}"><span class="game-tag">${g.tag}</span><span class="game-emoji">${g.emoji}</span></div>
      <div class="game-info"><h4>${g.title}</h4><p>${g.description}</p><div class="game-meta"><span>${g.category}</span><span class="play-pill">JOGAR →</span></div></div>
    </article>`).join("");
    $("emptyState").classList.toggle("hidden",list.length!==0);
  }
  function selectGame(id){
    const game=games.find(g=>g.id===id); if(!game)return;
    cleanupGame(); currentGame=game; recent=[id,...recent.filter(x=>x!==id)].slice(0,5);
    $("gameTitle").textContent=game.title;$("gameCategory").textContent=game.category;$("gameDescription").textContent=game.description;
    $("searchWrap").classList.add("hidden");catalog.classList.add("hidden");screen.classList.remove("hidden");
    window.scrollTo({top:0,behavior:"smooth"}); launchGame(game);
  }
  function backToCatalog(){
    cleanupGame();screen.classList.add("hidden");catalog.classList.remove("hidden");
    $("searchWrap").classList.remove("hidden");window.scrollTo({top:$("gamesSection").offsetTop-90,behavior:"smooth"});
  }
  function cleanupGame(){if(typeof gameCleanup==="function"){gameCleanup();gameCleanup=null;} $("gameStage").innerHTML="";}
  function launchGame(g){
    const stage=$("gameStage");
    if(g.kind==="click") launchClick(stage);
    else if(g.kind==="memory") launchMemory(stage);
    else if(g.kind==="guess") launchGuess(stage);
    else if(g.kind==="space") launchSpace(stage);
    else if(g.kind==="color") launchColor(stage);
    else if(g.kind==="external") launchExternal(stage, g);
  }

  function launchExternal(stage, game){
    const allowedHosts = ["play.famobi.com", "html5.gamedistribution.com"];
    let parsed;
    try { parsed = new URL(game.gameUrl); } catch (_) {
      stage.innerHTML = '<p class="load-error">Endereço de jogo inválido.</p>';
      return;
    }
    if (parsed.protocol !== "https:" || !allowedHosts.includes(parsed.hostname)) {
      stage.innerHTML = '<p class="load-error">Este endereço não está na lista de provedores permitidos.</p>';
      return;
    }
    stage.innerHTML = `
      <div class="external-game-wrap">
        <iframe class="external-game-frame"
          src="${game.gameUrl}"
          title="${game.title}"
          allow="fullscreen; autoplay; gamepad"
          allowfullscreen
          loading="eager"
          referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
      <p class="external-fallback">Se o jogo não carregar dentro da página, <a href="${game.gameUrl}" target="_blank" rel="noopener noreferrer">abra o jogo em uma nova aba</a>.</p>
    `;
    const frame = stage.querySelector("iframe");
    gameCleanup = () => { if (frame) frame.src = "about:blank"; };
  }
  function launchClick(stage){
    stage.innerHTML=`<div class="mini-panel"><h2>Acerto rápido!</h2><p>Clique no alvo rosa o máximo que puder em 20 segundos.</p><div class="scoreline">Pontos: <b id="clickScore">0</b> · Tempo: <b id="clickTime">20</b>s</div><div class="target-area" id="targetArea"><button class="target" id="target" aria-label="Alvo">✦</button></div><button class="mini-button" id="clickStart">Começar</button></div>`;
    let score=0,time=20,timer=null,active=false;
    const target=$("target"),area=$("targetArea");
    function move(){const maxX=area.clientWidth-58,maxY=area.clientHeight-58;target.style.left=Math.max(0,Math.random()*maxX)+"px";target.style.top=Math.max(0,Math.random()*maxY)+"px";}
    target.addEventListener("click",()=>{if(!active)return;score++;$("clickScore").textContent=score;move();});
    $("clickStart").onclick=()=>{if(active)return;score=0;time=20;active=true;$("clickScore").textContent=0;$("clickTime").textContent=time;$("clickStart").textContent="Jogando...";move();timer=setInterval(()=>{time--;$("clickTime").textContent=time;if(time<=0){clearInterval(timer);active=false;$("clickStart").textContent=`Fim! ${score} pontos — jogar de novo`; }},1000);};
    gameCleanup=()=>clearInterval(timer);
  }
  function launchMemory(stage){
    const symbols=["🍓","🚀","🐸","🌟","🎈","🍉","🦊","🎮"];
    let first=null,lock=false,matches=0,moves=0,deck=[];
    stage.innerHTML=`<div class="mini-panel"><h2>Encontre os pares</h2><p>Vire duas cartas por vez e combine os símbolos.</p><div class="scoreline">Pares: <b id="pairs">0</b>/8 · Tentativas: <b id="moves">0</b></div><div class="memory-grid" id="memoryGrid"></div><button class="mini-button alt" id="memoryReset">Embaralhar</button></div>`;
    function setup(){deck=[...symbols,...symbols].sort(()=>Math.random()-.5);first=null;lock=false;matches=0;moves=0;$("pairs").textContent=0;$("moves").textContent=0;
      $("memoryGrid").innerHTML=deck.map((s,i)=>`<button class="memory-card" data-index="${i}" aria-label="Carta fechada">?</button>`).join("");
      $("memoryGrid").querySelectorAll("button").forEach(btn=>btn.onclick=()=>flip(btn));}
    function flip(btn){if(lock||btn.classList.contains("open")||btn.classList.contains("done"))return;const i=+btn.dataset.index;btn.textContent=deck[i];btn.classList.add("open");if(first===null){first=btn;return;}moves++;$("moves").textContent=moves;if(deck[+first.dataset.index]===deck[i]){first.classList.add("done");btn.classList.add("done");first=null;matches++;$("pairs").textContent=matches;if(matches===8)$("memoryGrid").insertAdjacentHTML("afterend",'<p class="scoreline">🎉 Você encontrou todos os pares!</p>');}else{lock=true;const old=first;first=null;setTimeout(()=>{old.textContent="?";btn.textContent="?";old.classList.remove("open");btn.classList.remove("open");lock=false;},700);}}
    $("memoryReset").onclick=setup;setup();gameCleanup=()=>{};
  }
  function launchGuess(stage){
    let secret=Math.floor(Math.random()*100)+1,tries=0;
    stage.innerHTML=`<div class="mini-panel"><h2>Qual é o número?</h2><p>Pensei em um número de 1 a 100. Você consegue descobrir?</p><div class="big-number">?</div><input class="guess-input" id="guessInput" type="number" min="1" max="100" placeholder="1–100"><button class="mini-button" id="guessTry">Tentar</button><p id="guessHint" aria-live="polite">Digite um número e descubra a dica.</p><button class="mini-button alt" id="guessReset">Novo número</button></div>`;
    const check=()=>{const n=Number($("guessInput").value);if(!Number.isInteger(n)||n<1||n>100){$("guessHint").textContent="Digite um número inteiro entre 1 e 100.";return;}tries++;if(n===secret){$("guessHint").textContent=`🎉 Acertou em ${tries} tentativa(s)!`;stage.querySelector(".big-number").textContent=secret;}else $("guessHint").textContent=n<secret?"É maior! Tente novamente.":"É menor! Tente novamente.";};
    $("guessTry").onclick=check;$("guessInput").onkeydown=e=>{if(e.key==="Enter")check();};$("guessReset").onclick=()=>{secret=Math.floor(Math.random()*100)+1;tries=0;stage.querySelector(".big-number").textContent="?";$("guessHint").textContent="Novo número escolhido!";$("guessInput").value="";};
    gameCleanup=()=>{};
  }
  function launchSpace(stage){
    stage.innerHTML=`<div class="mini-panel"><h2>Desvie dos meteoros</h2><p>Use ← e → ou os botões para mover a nave.</p><div class="scoreline">Pontos: <b id="spaceScore">0</b></div><div class="target-area" id="spaceArea" style="background:linear-gradient(#24265c,#5144a5);height:250px"><div id="ship" style="position:absolute;bottom:12px;left:calc(50% - 20px);font-size:34px">🚀</div><div id="rock" style="position:absolute;top:0;left:30%;font-size:27px">☄️</div></div><button class="mini-button" id="leftMove">←</button><button class="mini-button" id="rightMove">→</button><button class="mini-button alt" id="spaceStart">Começar</button><p id="spaceStatus">Prepare-se!</p></div>`;
    let x=50,y=0,score=0,running=false,tick=null,dir=0;
    const ship=$("ship"),rock=$("rock"),area=$("spaceArea");
    const key=e=>{if(e.key==="ArrowLeft")dir=-1;if(e.key==="ArrowRight")dir=1;};const keyup=e=>{if(["ArrowLeft","ArrowRight"].includes(e.key))dir=0;};
    window.addEventListener("keydown",key);window.addEventListener("keyup",keyup);
    $("leftMove").onpointerdown=()=>dir=-1;$("rightMove").onpointerdown=()=>dir=1;
    $("leftMove").onpointerup=$("rightMove").onpointerup=()=>dir=0;
    function start(){if(running)return;running=true;score=0;y=0;x=50;$("spaceStatus").textContent="Valendo!";tick=setInterval(()=>{x=Math.max(4,Math.min(90,x+dir*2.5));y+=4;ship.style.left=`calc(${x}% - 18px)`;rock.style.top=y+"px";if(y>area.clientHeight-25){y=-25;rock.style.left=(5+Math.random()*85)+"%";score++;$("spaceScore").textContent=score;}const rx=parseFloat(rock.style.left)||30;if(y>area.clientHeight-65&&y<area.clientHeight-5&&Math.abs(x-rx)<12){clearInterval(tick);running=false;$("spaceStatus").textContent=`Fim de jogo! Você marcou ${score} ponto(s).`; }},50);}
    $("spaceStart").onclick=start;gameCleanup=()=>{clearInterval(tick);window.removeEventListener("keydown",key);window.removeEventListener("keyup",keyup);};
  }
  function launchColor(stage){
    let points=0,time=15,goal="AZUL",timer=null,active=false;
    const colors=[{name:"AZUL",color:"#4e8df5"},{name:"ROSA",color:"#ef6598"},{name:"VERDE",color:"#51bd8c"},{name:"AMARELO",color:"#e7b83e"}];
    stage.innerHTML=`<div class="mini-panel"><h2>Explosão de cores</h2><p>Clique no botão com a cor que aparece na instrução.</p><div class="scoreline">Alvo: <b id="colorGoal">AZUL</b> · Pontos: <b id="colorPoints">0</b> · <b id="colorTime">15</b>s</div><div id="colorButtons" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:25px 0"></div><button class="mini-button" id="colorStart">Começar</button><p id="colorStatus">Atenção às cores!</p></div>`;
    const next=()=>{goal=colors[Math.floor(Math.random()*colors.length)].name;$("colorGoal").textContent=goal;};
    $("colorButtons").innerHTML=colors.map(c=>`<button data-color="${c.name}" style="width:90px;height:70px;border-radius:15px;background:${c.color};color:white;font-weight:900">${c.name}</button>`).join("");
    $("colorButtons").querySelectorAll("button").forEach(b=>b.onclick=()=>{if(!active)return;if(b.dataset.color===goal){points++;$("colorPoints").textContent=points;$("colorStatus").textContent="Boa!";}else $("colorStatus").textContent="Ops, tente prestar atenção!";next();});
    $("colorStart").onclick=()=>{if(active)return;active=true;points=0;time=15;$("colorPoints").textContent=0;$("colorTime").textContent=time;next();timer=setInterval(()=>{time--;$("colorTime").textContent=time;if(time<=0){clearInterval(timer);active=false;$("colorStatus").textContent=`Tempo! Sua pontuação: ${points}.`; $("colorStart").textContent="Jogar novamente";}},1000);};
    gameCleanup=()=>clearInterval(timer);
  }
  $("categoryFilters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;renderFilters();renderGames();});
  grid.addEventListener("click",e=>{const card=e.target.closest("[data-game]");if(card)selectGame(card.dataset.game);});
  grid.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-game]")){e.preventDefault();selectGame(e.target.dataset.game);}});
  $("searchToggle").onclick=()=>{$("searchWrap").classList.remove("hidden");$("searchInput").focus();$("gamesSection").scrollIntoView({behavior:"smooth"});};
  $("searchInput").addEventListener("input",e=>{query=e.target.value;renderGames();});
  $("clearSearch").onclick=()=>{$("searchInput").value="";query="";renderGames();};
  $("backButton").onclick=backToCatalog;$("homeButton").onclick=e=>{e.preventDefault();if(!screen.classList.contains("hidden"))backToCatalog();else window.scrollTo({top:0,behavior:"smooth"});};
  $("exploreButton").onclick=()=>$("gamesSection").scrollIntoView({behavior:"smooth"});
  $("surpriseButton").onclick=()=>{const list=filteredGames();const chosen=list[Math.floor(Math.random()*list.length)]||games[Math.floor(Math.random()*games.length)];selectGame(chosen.id);};
  $("restartButton").onclick=()=>{if(currentGame)selectGame(currentGame.id);};
  $("fullscreenButton").onclick=()=>{const stage=$("gameStage");if(!document.fullscreenElement){if(stage.requestFullscreen)stage.requestFullscreen().catch(()=>{});}else document.exitFullscreen?.();};
  renderFilters();renderGames();
})();