'use strict';

(() => {
  const projects = [
    {id:'448',cohort:'15기',title:'AX Module Studio',description:'CMS 운영과 개발 작업을 AI로 지원하는 관리 플랫폼',team:'민ㅇ준 · 민ㅇ지 · 장ㅇ윤 · 이ㅇ욱'},
    {id:'447',cohort:'15기',title:'DAENGS',description:'우리 아이의 하루를 더 가까이, 반려동물 서비스',team:'조ㅇ주 · 최ㅇ우 · 김ㅇ희 · 임ㅇ현 · 홍ㅇ현'},
    {id:'446',cohort:'15기',title:'햇들농산',description:'농산물 가격 예측 기반 의사결정 지원 시스템',team:'이ㅇ서 · 김ㅇ환 · 오ㅇ환 · 전ㅇ만 · 이ㅇ훈'},
    {id:'445',cohort:'14기',title:'SYNAPSE',description:'디지털 데이터로 나를 진단하고, 이상향을 설계하다',team:'조ㅇ준 · 이ㅇ진 · 김ㅇ빈'},
    {id:'444',cohort:'14기',title:'ClickMe',description:'광고, 다 알아서 해드립니다.',team:'정ㅇ한 · 강ㅇ구 · 구ㅇ은 · 권ㅇ연 · 여ㅇ호 · 임ㅇ섭'},
    {id:'443',cohort:'14기',title:'SIGNAL ALPHA',description:'TEAM LENS의 생성형 AI 프로젝트',team:'임ㅇ태 · 윤ㅇ진 · 엄ㅇ슬 · 최ㅇ현'}
  ];
  const grid = document.querySelector('#project-grid');
  const dialog = document.querySelector('#project-dialog');
  const content = document.querySelector('#project-content');
  let lastFocused;
  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function openProject(project, updateUrl = true) {
    if (!project) return;
    const intro = node('div','project-intro');
    intro.append(node('p','eyebrow',`AI 심화과정 ${project.cohort} · 팀 프로젝트`));
    const title = node('h2','',project.title); title.id='project-title';
    intro.append(title,node('p','project-description',project.description),node('p','project-team',project.team));
    const source = node('a','project-source','공식 홈페이지에서 원본 보기 ↗');
    source.href=`https://www.himedia.co.kr/Portfolio/view/it/${project.id}`;
    source.target='_blank'; source.rel='noopener noreferrer'; intro.append(source);
    const image = node('img','project-detail-image');
    image.src=`assets/projects/${project.id}-detail.jpg`; image.alt=`${project.title} 프로젝트 발표 자료 전체`;
    const loading = node('p','project-image-status','발표 자료를 불러오는 중입니다.');
    image.addEventListener('load',()=>loading.remove());
    image.addEventListener('error',()=>{image.hidden=true;loading.textContent='위 원본 보기 링크에서 발표 자료를 확인해 주세요.';});
    content.replaceChildren(intro,loading,image);
    lastFocused=document.activeElement;
    if(!dialog.open) dialog.showModal();
    document.body.classList.add('project-open'); dialog.scrollTop=0;
    document.querySelector('#close-project').focus();
    if(updateUrl) history.replaceState(null,'',`#project=${project.id}`);
  }
  for(const project of projects) {
    const button=node('button','project-card'); button.type='button';
    button.setAttribute('aria-label',`${project.title} 프로젝트 자세히 보기`);
    const cover=node('div','project-cover');
    const image=node('img'); image.src=`assets/projects/${project.id}-thumb.jpg`;image.alt=`${project.title} 프로젝트 대표 화면`;
    image.loading='lazy'; image.width=415;image.height=415;
    cover.append(image,node('span','project-open-icon','↗'));
    const text=node('div','project-card-text');
    text.append(node('p','project-cohort',`AI 심화과정 ${project.cohort}`),node('h3','',project.title),node('p','',project.description));
    button.append(cover,text);button.addEventListener('click',()=>openProject(project));grid.append(button);
  }
  document.querySelector('#close-project').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
  });
  dialog.addEventListener('close',()=>{
    document.body.classList.remove('project-open');
    if(location.hash.startsWith('#project='))history.replaceState(null,'','#projects');
    if(lastFocused?.isConnected)lastFocused.focus();
  });
  function openHash(){
    if(!location.hash.startsWith('#project=')){if(dialog.open)dialog.close();return;}
    openProject(projects.find(project=>project.id===location.hash.slice(9)),false);
  }
  window.addEventListener('hashchange',openHash);openHash();
})();
