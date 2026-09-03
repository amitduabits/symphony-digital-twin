%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% csf301-notes.cls -- lecture notes class for CS F301
%%
%% Usage:
%%   \documentclass[minted]{csf301-notes}
%%   \moduleinfo{05}{Arrays}{L6}{Amit Dua}
%%   \begin{document}\notestitle ... \end{document}
%%
%% Follows the structure of the BITS F463 Cryptography notes: numbered
%% sections, numbered definitions, boxed key ideas and warnings, worked
%% examples, discussion questions with solutions at the end.
%%
%% Definition numbering is stable once published. Append, never renumber.
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{csf301-notes}[2025/08/02 v1.0 CS F301 lecture notes]

\newif\ifcsf@n@minted \csf@n@mintedtrue
\DeclareOption{listings}{\csf@n@mintedfalse}
\DeclareOption{minted}{\csf@n@mintedtrue}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions\relax

\LoadClass[11pt,a4paper]{article}

\ifcsf@n@minted
  \RequirePackage[minted]{bitspreamble}
\else
  \RequirePackage[listings]{bitspreamble}
\fi

\RequirePackage[margin=1in,bottom=1.15in,top=1.15in]{geometry}
\RequirePackage{fancyhdr}
\RequirePackage{titlesec}
\RequirePackage{parskip}

%%--------------------------------------------------------------------------
%% 1. Module metadata
%%--------------------------------------------------------------------------
\newcommand{\csf@modnum}{00}
\newcommand{\csf@modname}{Untitled}
\newcommand{\csf@lectures}{L?}
\newcommand{\csf@instructor}{}
\newcommand{\moduleinfo}[4]{%
  \renewcommand{\csf@modnum}{#1}%
  \renewcommand{\csf@modname}{#2}%
  \renewcommand{\csf@lectures}{#3}%
  \renewcommand{\csf@instructor}{#4}}

%%--------------------------------------------------------------------------
%% 2. Definition numbering keyed to the module number
%% Module 05 produces Definition 5.1, 5.2, ... so a slide can cite
%% "Definition 5.2" and the reference survives a rebuild.
%%--------------------------------------------------------------------------
\newcommand{\setmodulecounters}{%
  \setcounter{section}{0}%
  \renewcommand{\thesection}{\number\numexpr\csf@modnum\relax.\arabic{section}}%
}

%%--------------------------------------------------------------------------
%% 3. Headers and footers
%%--------------------------------------------------------------------------
\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}
\fancyhead[L]{\footnotesize\color{mutedgrey}\coursecode\ \textperiodcentered\ Module \csf@modnum: \csf@modname}
\fancyhead[R]{\footnotesize\color{mutedgrey}\bitssemester}
\fancyfoot[C]{\footnotesize\color{mutedgrey}\thepage}
\fancyfoot[L]{\raisebox{-1ex}{\bitslogo[0.55cm]}}
\fancyfoot[R]{\footnotesize\color{mutedgrey}BITS Pilani}

\fancypagestyle{firstpage}{%
  \fancyhf{}%
  \renewcommand{\headrulewidth}{0pt}%
  \fancyfoot[C]{\footnotesize\color{mutedgrey}\thepage}}

%%--------------------------------------------------------------------------
%% 4. Section styling
%%--------------------------------------------------------------------------
\titleformat{\section}
  {\sffamily\large\bfseries\color{bitsblue}}{\thesection}{0.8em}{}
  [\vspace{-0.55em}{\color{rulegrey}\rule{\linewidth}{0.5pt}}]
\titleformat{\subsection}
  {\sffamily\normalsize\bfseries\color{bitsblue!85!black}}{\thesubsection}{0.7em}{}
\titleformat{\subsubsection}
  {\sffamily\small\bfseries\color{black}}{\thesubsubsection}{0.6em}{}
\titlespacing*{\section}{0pt}{1.4em}{0.6em}
\titlespacing*{\subsection}{0pt}{1.0em}{0.4em}

%%--------------------------------------------------------------------------
%% 5. Title block
%%--------------------------------------------------------------------------
\newcommand{\notestitle}{%
  \thispagestyle{firstpage}
  \noindent
  \begin{minipage}[c]{0.15\textwidth}\bitslogo[2.1cm]\end{minipage}%
  \begin{minipage}[c]{0.83\textwidth}\bitsidentity\end{minipage}

  \vspace{0.4em}
  \noindent\bitsbar[\textwidth]{2.4pt}

  \vspace{1.1em}
  \begin{center}
    {\sffamily\small\color{mutedgrey} \coursecode\ \textbar\ \coursetitle}\\[0.55em]
    {\sffamily\LARGE\bfseries\color{bitsblue} Module \csf@modnum: \csf@modname}\\[0.45em]
    {\sffamily\small\color{mutedgrey} Lectures \csf@lectures\ \textperiodcentered\ \csf@instructor\ \textperiodcentered\ \bitssemester}
  \end{center}

  \vspace{0.6em}
  \noindent{\color{rulegrey}\rule{\textwidth}{0.5pt}}
  \vspace{0.8em}
  \setmodulecounters
}

%%--------------------------------------------------------------------------
%% 6. Theorem-like environments
%% Numbered <module>.<n> so cross-artefact citation is stable.
%%--------------------------------------------------------------------------
\theoremstyle{definition}
\newtheorem{definition}{Definition}[section]
\newtheorem{theorem}[definition]{Theorem}
\newtheorem{lemma}[definition]{Lemma}
\newtheorem{proposition}[definition]{Proposition}
\newtheorem{corollary}[definition]{Corollary}

\renewenvironment{proof}{\par\noindent\textit{Proof.}\ }{\hfill$\square$\par}

%%--------------------------------------------------------------------------
%% 7. Boxed environments (Master Spec section 4.2)
%%--------------------------------------------------------------------------

%% keyidea -- the one thing to remember
\newtcolorbox{keyidea}[1][Key idea]{%
  breakable, enhanced,
  colback=bitsgold!7, colframe=bitsgold, boxrule=0pt,
  leftrule=3pt, arc=1pt,
  title={\sffamily\bfseries\color{bitsgold!55!black}#1},
  coltitle=bitsgold!55!black, colbacktitle=bitsgold!7,
  fonttitle=\small, boxed title style={empty},
  attach boxed title to top left={xshift=6pt,yshift=-2pt},
  top=8pt,bottom=6pt,left=8pt,right=6pt}

%% warning -- dangerous or surprising behaviour
\newtcolorbox{warning}[1][Warning]{%
  breakable, enhanced,
  colback=errred!4, colframe=errred, boxrule=0pt,
  leftrule=3pt, arc=1pt,
  title={\sffamily\bfseries\color{errred}#1},
  coltitle=errred, colbacktitle=errred!4,
  fonttitle=\small, boxed title style={empty},
  attach boxed title to top left={xshift=6pt,yshift=-2pt},
  top=8pt,bottom=6pt,left=8pt,right=6pt}

%% example -- worked, complete, with output
\newtcolorbox{example}[1][Example]{%
  breakable, enhanced,
  colback=black!3, colframe=mutedgrey, boxrule=0pt,
  leftrule=3pt, arc=1pt,
  title={\sffamily\bfseries\color{black!75}#1},
  coltitle=black!75, colbacktitle=black!3,
  fonttitle=\small, boxed title style={empty},
  attach boxed title to top left={xshift=6pt,yshift=-2pt},
  top=8pt,bottom=6pt,left=8pt,right=6pt}

%% implnote -- how a compiler actually does this
\newtcolorbox{implnote}[1][Implementation]{%
  breakable, enhanced,
  colback=white, colframe=bitssky!70!black, boxrule=0pt,
  leftrule=3pt, arc=1pt,
  title={\sffamily\bfseries\color{bitssky!45!black}#1},
  coltitle=bitssky!45!black, colbacktitle=white,
  fonttitle=\small, boxed title style={empty},
  attach boxed title to top left={xshift=6pt,yshift=-2pt},
  top=8pt,bottom=6pt,left=8pt,right=6pt}

%% langbox -- cross-language comparison table wrapper
\newenvironment{langbox}[1][Across languages]{%
  \begin{tcolorbox}[breakable,enhanced,
    colback=white,colframe=bitsblue,boxrule=0.7pt,arc=1pt,
    title={\sffamily\bfseries\small #1},coltitle=white,colbacktitle=bitsblue,
    top=6pt,bottom=6pt]}{%
  \end{tcolorbox}}

%%--------------------------------------------------------------------------
%% 8. Discussion questions and solutions
%% Solutions live in a final section. \dq numbers questions; \soln{n} cites
%% the matching question so the pairing cannot rot.
%%--------------------------------------------------------------------------
\newcounter{dqcounter}
\renewcommand{\thedqcounter}{\arabic{dqcounter}}

\newenvironment{dq}[1][]{%
  \refstepcounter{dqcounter}%
  \par\medskip\noindent
  {\sffamily\bfseries\color{bitsblue}Question \thedqcounter\ifx\relax#1\relax\else: #1\fi}%
  \par\nopagebreak\smallskip}{\par\medskip}

\newenvironment{soln}[1]{%
  \par\medskip\noindent
  {\sffamily\bfseries\color{bitsblue}Solution to Question #1}%
  \par\nopagebreak\smallskip}{\par\medskip}

%% Cognitive level tag for exercises, consumed by tools/xref-audit.py
\newcommand{\level}[1]{\muted{\scriptsize[L#1]}}
\newcommand{\tagfor}[1]{\muted{\scriptsize[#1]}}

%%--------------------------------------------------------------------------
%% 9. Misconceptions list
%%--------------------------------------------------------------------------
\newenvironment{misconceptions}{%
  \section{Common misconceptions}
  \begin{description}[leftmargin=0pt,labelsep=0.6em,style=nextline,
                      font=\sffamily\bfseries\color{errred}]}{%
  \end{description}}

\endinput
