# LEGT — Valorant Profile & Rank Tracker (Remake moderno)

## 0) Visão (o “porquê”)
LEGT é um site/app de perfis de VALORANT onde o jogador entra, conecta a conta Riot (RSO) e recebe uma página de perfil **extremamente satisfatória** de ver: cards, bordas animadas por elo, “rank journey”, histórico de partidas, estatísticas profundas e insights visuais.

O objetivo é o usuário:
- abrir o perfil e ficar “uau, que bonito”;
- entender onde está evoluindo/caindo;
- compartilhar o link do perfil com orgulho.

## 1) Regras de dados (Riot / compliance)
- Para VALORANT Official APIs, é necessário **Production Key** e apps precisam implementar **Riot Sign On (RSO)** com opt-in de dados. (sem isso, não dá pra operar direito e nem ser aprovado).
- A política da Riot reforça: **nada de “perfil pessoal” ou “scouting de jogadores” sem que o player tenha optado por compartilhar**.
  - Ex.: Player vê o próprio perfil: ok via login RSO.
  - Ex.: Player Y vê Player X: só se Player X optou por deixar público + audit/registro de opt-in.

Referências:
- “Getting a Production Key” + “Implementing RSO” + endpoint `/riot/account/v1/accounts/me`.
- Endpoints oficiais mínimos: content, match by id, matchlist by puuid, ranked leaderboard, status.
(Links e detalhes ficam no bloco “Integração de Dados”.)

## 2) Escopo MVP (primeira entrega que já encanta)
### 2.1 Autenticação e Conta
- Login com Riot (RSO OAuth).
- Criar “LEGT Profile” (tabela de usuário) com:
  - puuid, gameName, tagLine, region/shard
  - flag `is_profile_public` (opt-in)
  - preferências visuais (tema, card style, mostrar/ocultar stats)

### 2.2 Página de Perfil (core)
A página tem “layout de colecionável”:
- Header “Player Banner”
  - Nome + Tag + Região
  - Card do Elo atual (com borda premium)
  - Peak Elo (ato atual + histórico)
  - RR/Progress (se disponível)
- Seção “Rank Journey”
  - linha do tempo por Ato (cards por act) com peak, wins, mmr/rank
- Seção “Snapshot”
  - K/D, HS%, Winrate, ACS médio, ADR, KAST (e outros)
  - comparativos vs “média do seu elo” (quando possível)
- Seção “Agentes”
  - cards dos top 3 agentes (pick rate + win rate + K/D + ACS)
- Seção “Partidas Recentes”
  - lista em cards com:
    - mapa, modo/queue, placar, resultado
    - agent, ACS, K/D/A, HS%, multi-kills, first blood
    - “impact badge” (MVP, Clutch, Entry, Support, etc.)
  - clicar abre “Match Report” (detalhe)

### 2.3 Match Report (detalhe)
- Resumo do jogo: mapa, duração, lado, placar, queue
- Performance do player:
  - rounds impact, multi-kills, clutch 1vX (se detectável)
- Timeline simplificada:
  - “momentos” (ex.: round com 3k, clutch)
- Tabela do time:
  - ACS / K / D / A / ADR / HS% / FK / FD / Econ
- Sharing:
  - botão “Gerar Card de Partida” (imagem/OG preview) para compartilhar

### 2.4 Descoberta e Links
- Pesquisa por Riot ID (gameName#tag) com regra:
  - se perfil não for público e você não for o dono logado: mostrar tela “Perfil privado”.
- URL bonita:
  - `/@/{region}/{name}-{tag}`
- OpenGraph (preview no WhatsApp/Twitter/Discord) com:
  - nome, elo, peak, 3 stats principais e uma borda por elo

## 3) Experiência Visual (o que vai fazer a galera amar)
### 3.1 Sistema de “Card Skins” por Elo
- Cada elo tem:
  - paleta (gradiente), borda, “glow”, textura sutil
  - micro-animações (hover com tilt, brilho leve)
- “Peak Badge” com moldura diferente
- “Act Badge” colecionável (cards por Ato)

### 3.2 Componentes principais
- `RankCard` (hero)
- `StatsTiles` (8–12 tiles)
- `AgentCards`
- `MatchCards`
- `BadgeSystem` (MVP / Clutch / Entry / Support / Consistency)

### 3.3 “Satisfação”
- Skeleton loading bonito
- Transições suaves
- Layout bem respirado e premium
- Mobile-first, mas com desktop “WOW”

## 4) Integração de Dados (2 caminhos)
### Caminho A (recomendado p/ longo prazo): Riot Official APIs + RSO
- Requer aprovar app e obter Production Key.
- Endpoints oficiais relevantes (mínimo):
  - `VAL-CONTENT-V1 /val/content/v1/contents`
  - `VAL-MATCH-V1 /val/match/v1/matches/{matchId}`
  - `VAL-MATCH-V1 /val/match/v1/matchlists/by-puuid/{puuid}`
  - `VAL-RANKED-V1 /val/ranked/v1/leaderboards/by-act/{actId}`
  - `VAL-STATUS-V1 /val/status/v1/platform-data`
- Além disso, via RSO:
  - `/riot/account/v1/accounts/me` (descobrir identidade do logado)

Observação de produto:
- Para mostrar histórico/partidas de um player, ele precisa:
  - logar (RSO) e aceitar opt-in;
  - opcionalmente marcar perfil público.

### Caminho B (rápido para protótipo): API “unofficial” (ex.: HenrikDev)
- Pro: acelera MVP visual (rank + match history + MMR history).
- Contra: depende de serviço terceiro e pode ter limitações/risco.
- Usar com camada de cache e “modo fallback”.

Estratégia:
- MVP pode começar com B para validar UI/amor do público,
- e migrar para A assim que o app estiver “pitch-ready” pra Riot.

## 5) Arquitetura e Stack (sugestão objetiva)
### Front
- Next.js (App Router) + Tailwind
- Framer Motion (microanimações)
- Recharts (gráficos simples rank journey / trends)
- SSR/ISR para páginas públicas (quando permitido)

### Back
- API layer (Next route handlers ou FastAPI/Nest)
- Redis (cache agressivo por player+act)
- Postgres (profiles, opt-in logs, snapshots agregados)

### Banco (tabelas mínimas)
- `users` (auth + puuid)
- `profiles` (puuid, region, name, tag, public, cosmetics prefs)
- `optin_audit` (user_id, timestamp, ip, scope)
- `matches_cache` (puuid, match_id, payload, fetched_at)
- `stats_snapshots` (puuid, act_id, aggregated stats)

### Cache & Rate limit
- Cache por:
  - matchlist (curto)
  - match details (longo)
  - snapshots (médio)
- “Backfill worker”:
  - quando o player entra, puxa N últimas partidas e gera snapshots

## 6) Roadmap (3 fases sem brecha)
### Fase 1 — MVP “Uau” (perfil + match cards)
- RSO login, perfil privado, página do dono
- Match list + match details + cards + sharing OG
- Sistema visual por elo

### Fase 2 — Público/Compartilhável
- opt-in + `is_profile_public`
- rotas públicas e preview OG
- rank journey por ato, trends, top agents, badges

### Fase 3 — Viral + Retenção
- “Weekly Recap” (resumo da semana)
- Comparar “você vs você” (últimos 30 dias vs 30 anteriores)
- “Elo Insights”: onde ganha/perde (mapas/agentes)
- Leaderboards internos (somente opt-in)

## 7) Definição de “stats” (primeiras métricas)
Básicas:
- Winrate, K/D, ACS, ADR, HS%, KAST, DDA (se houver), FK/FD
Por agente:
- pick rate, winrate, kd, acs
Por mapa:
- winrate + performance
Badges:
- Clutch (1v1/1v2/1v3), Entry, Support, Consistency, MVP-like

## 8) Critérios de sucesso do MVP
- Tempo de carregamento aceitável (cache + skeleton)
- “Share rate” alto (botão copiar link + OG bonito)
- Perfil tem “efeito colecionável”
- Jogador entende: “o que eu faço bem / o que melhorar”

---

# Prompt para Claude Code (instruções de implementação)
Você é um engenheiro full-stack sênior. Crie o repositório do LEGT com Next.js (App Router), Tailwind e componentes premium.
Objetivo: Implementar Fase 1 do MVP com foco em UI “wow” e dados iniciais.

Requisitos:
1) Estrutura:
- apps/web (Next.js)
- packages/ui (componentes: RankCard, MatchCard, AgentCard, StatsTiles)
- packages/lib (helpers: region, shard, api client, cache keys)

2) Páginas:
- / (home com search Riot ID)
- /login (RSO placeholder + provider)
- /me (perfil do usuário logado)
- /@/[region]/[riotId] (rota pública com gate: se não for public, bloquear)

3) Dados:
- Criar “DataProvider” com interface:
  - getAccountByRiotId(region, name, tag)
  - getMatchlistByPuuid(region, puuid)
  - getMatchById(region, matchId)
  - getRankSnapshot(region, puuid)
- Implementar inicialmente com “ProviderB” (unofficial) e deixar “ProviderA” como stub para Riot Official + RSO.
- Implementar cache (in-memory ou Redis-ready) com TTL.

4) UI:
- Sistema de tema por Elo:
  - arquivo rankTheme.ts com paletas/gradientes/bordas
- Componentes com Framer Motion:
  - hover tilt leve, glow animado, skeleton loaders
- OG meta tags com preview do rank card

5) Segurança e Regras:
- Guardar opt-in audit (tabela) e não permitir rota pública sem `is_profile_public`.

Entregáveis:
- Código pronto para rodar local (pnpm), com .env.example
- Componentes bem organizados e reutilizáveis
- Padrão de fetch com retry/backoff e cache
- README com comandos e checklist de deploy
