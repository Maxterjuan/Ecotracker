document.addEventListener("DOMContentLoaded",()=>{

  // ── STATE ──────────────────────────────────────────────
  let userPoints=120, habitsCompleted=0, quizzesCompleted=0;

  // ── SIDEBAR MOBILE ─────────────────────────────────────
  const hamburger=document.getElementById("hamburger");
  const overlay=document.getElementById("overlay");

  function getAllSidebars(){
    return document.querySelectorAll(".sidebar");
  }

  function openSidebar(){
    getAllSidebars().forEach(s=>s.classList.add("open"));
    overlay.classList.add("active");
    hamburger.style.display="none";
  }
  function closeSidebar(){
    getAllSidebars().forEach(s=>s.classList.remove("open"));
    overlay.classList.remove("active");
    hamburger.style.display="";
  }

  hamburger.addEventListener("click",openSidebar);
  overlay.addEventListener("click",closeSidebar);

  // ── SCREENS ────────────────────────────────────────────
  function showScreen(id){
    document.querySelectorAll(".screen").forEach(s=>{
      s.style.display="none";
    });
    const el=document.getElementById(id);
    if(el) el.style.display="block";
    closeSidebar();
    window.scrollTo(0,0);
  }

  showScreen("login-screen");

  // ── NAVIGATION ─────────────────────────────────────────
  document.querySelectorAll(".menu-card").forEach(c=>{
    c.addEventListener("click",e=>{
      e.preventDefault();
      const t=c.dataset.navigate;
      if(t) showScreen(t+"-screen");
    });
  });

  document.querySelectorAll(".back-btn").forEach(b=>{
    b.addEventListener("click",e=>{
      e.preventDefault();
      showScreen("dashboard-screen");
    });
  });

  // ── LOGIN ──────────────────────────────────────────────
  document.getElementById("auth-form").addEventListener("submit",e=>{
    e.preventDefault();
    const nome=document.getElementById("name-input").value.trim()||"Usuário";
    const email=document.getElementById("email-input").value.trim()||"email@exemplo.com";
    const ini=nome.charAt(0).toUpperCase();

    document.getElementById("user-name").textContent=nome;
    document.getElementById("profile-name").textContent=nome;
    document.getElementById("profile-email").textContent=email;
    document.getElementById("profile-avatar").textContent=ini;
    document.getElementById("profile-avatar-page").textContent=ini;

    atualizarDados();
    showScreen("dashboard-screen");
  });

  // ── LOGOUT ─────────────────────────────────────────────
  document.getElementById("logout-btn").addEventListener("click",()=>{
    document.getElementById("auth-form").reset();
    showScreen("login-screen");
  });

  // ── EDUCAÇÃO — toggles ─────────────────────────────────
  document.querySelectorAll(".edu-toggle").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const card=document.getElementById(btn.dataset.target);
      const detail=card.querySelector(".edu-detail");
      detail.classList.toggle("hidden");
      btn.textContent=detail.classList.contains("hidden")?"Ver mais":"Ver menos";
    });
  });

  // ── HÁBITOS ────────────────────────────────────────────
  document.querySelectorAll(".habit-check").forEach(ch=>{
    ch.addEventListener("click",()=>{
      if(ch.classList.contains("active")) return;
      ch.classList.add("active");
      const txt=ch.parentElement.innerText;
      let pts=0;
      if(txt.includes("20")) pts=20;
      else if(txt.includes("30")) pts=30;
      else if(txt.includes("15")) pts=15;
      else if(txt.includes("10")) pts=10;
      else if(txt.includes("25")) pts=25;
      userPoints+=pts;
      habitsCompleted++;
      atualizarDados();
    });
  });

  // ── ATUALIZAR DADOS ────────────────────────────────────
  function atualizarDados(){
    document.getElementById("user-points").textContent=userPoints;
    document.getElementById("prof-points").textContent=userPoints;
    document.getElementById("prof-stat-habits").textContent=habitsCompleted;
    document.getElementById("prof-stat-quizzes").textContent=quizzesCompleted;
    document.getElementById("prof-stat-challenges").textContent=0;
    document.getElementById("habits-count").textContent=habitsCompleted+" hábitos completados";
    document.getElementById("habits-daily-pts").textContent="+"+(userPoints-120);
    document.getElementById("report-items").textContent=habitsCompleted;
    document.getElementById("report-plastic").textContent=(habitsCompleted*0.2).toFixed(1)+" kg";
    document.getElementById("report-tag-items").textContent=habitsCompleted+" itens reciclados";
    document.getElementById("report-tag-plastic").textContent=(habitsCompleted*0.2).toFixed(1)+" kg de plástico evitado";
    document.getElementById("report-tag-pts").textContent=userPoints+" EcoPoints";
    document.getElementById("weekly-meta").textContent=userPoints+"/500";
    const prog=Math.min(userPoints/5,100);
    document.getElementById("progress-fill").style.width=prog+"%";
    document.getElementById("weekly-progress").textContent=prog.toFixed(0)+"% concluído esta semana";
    document.getElementById("banner-points").textContent="+"+(userPoints-120)+" pontos hoje";
  }

  // ── QUIZ ───────────────────────────────────────────────
  const perguntas=[
    {q:"Qual é o tempo aproximado de decomposição de uma garrafa PET?",o:["10 anos","50 anos","400 anos","1000 anos"],c:2},
    {q:"Qual material pode ser reciclado?",o:["Vidro","Papel sujo","Fralda","Espelho"],c:0},
    {q:"Qual hábito economiza água?",o:["Banho de 20 min","Escovar dentes com torneira aberta","Banho rápido","Lavar carro todo dia"],c:2},
    {q:"Qual gás contribui para o efeito estufa?",o:["Oxigênio","Nitrogênio","CO2","Hidrogênio"],c:2},
    {q:"O que significa reciclar?",o:["Queimar lixo","Reutilizar materiais","Enterrar resíduos","Jogar fora"],c:1}
  ];

  let atual=0, acertos=0;
  const qEl=document.getElementById("quiz-question");
  const optsEl=document.getElementById("quiz-options");
  const counterEl=document.getElementById("quiz-counter");
  const nextBtn=document.getElementById("btn-next");

  function carregarQuiz(){
    const p=perguntas[atual];
    counterEl.textContent="Questão "+(atual+1)+"/"+perguntas.length;
    qEl.textContent=p.q;
    optsEl.innerHTML="";
    p.o.forEach((op,i)=>{
      const d=document.createElement("div");
      d.className="quiz-option";
      d.textContent=op;
      d.addEventListener("click",()=>{
        optsEl.querySelectorAll(".quiz-option").forEach(x=>x.style.pointerEvents="none");
        if(i===p.c){d.classList.add("correct");acertos++;userPoints+=50;}
        else d.classList.add("wrong");
        atualizarDados();
        nextBtn.classList.remove("hidden");
      });
      optsEl.appendChild(d);
    });
  }

  carregarQuiz();

  nextBtn.addEventListener("click",()=>{
    atual++;
    if(atual>=perguntas.length){
      quizzesCompleted++;
      document.getElementById("quiz-card").classList.add("hidden");
      document.getElementById("quiz-finished").classList.remove("hidden");
      document.getElementById("quiz-final-score").textContent="Você acertou "+acertos+" de "+perguntas.length+" questões";
      atualizarDados();
      return;
    }
    nextBtn.classList.add("hidden");
    carregarQuiz();
  });

  document.getElementById("btn-restart-quiz").addEventListener("click",()=>{
    atual=0;acertos=0;
    document.getElementById("quiz-card").classList.remove("hidden");
    document.getElementById("quiz-finished").classList.add("hidden");
    nextBtn.classList.add("hidden");
    carregarQuiz();
  });

});
