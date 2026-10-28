import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client strictly with User-Agent header as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.post('/api/generate-cards', async (req, res) => {
  try {
    const { bookTitle, memorableScene } = req.body;

    const trimmedTitle = (bookTitle || '').trim();
    const trimmedScene = (memorableScene || '').trim();

    if (!trimmedTitle || !trimmedScene) {
      return res.status(400).json({
        isAppropriate: false,
        friendlyFeedback: '책 제목과 인상 깊은 장면을 모두 적어 주세요! 재미있는 생각 카드를 만들어 줄게요. 📖✨',
        cards: [],
      });
    }

    if (trimmedTitle.length < 2 || trimmedScene.length < 3) {
      return res.status(400).json({
        isAppropriate: false,
        friendlyFeedback: '책 제목과 인상 깊었던 장면을 조금 더 자세히 들려줄래요? 너의 생각이 궁금해요! 😊',
        cards: [],
      });
    }

    const systemInstruction = `
당신은 초등학교 4~6학년(만 10~12세) 학생들의 독서 논술과 사고력 확장을 돕는 다정하고 지혜로운 독서 지도 선생님입니다.
학생이 읽은 책의 제목과 인상 깊은 장면을 바탕으로, 생각을 넓혀 주는 맞춤형 '독서 생각 질문 카드' 3장을 만들어 주어야 합니다.

[중요 지침]
1. 부적절성 검사 (안전성 및 유효성):
   - 학생의 입력 내용(책 제목 또는 인상 깊은 장면)이 욕설, 비속어, 폭력적/선정적 내용, 장난성 무의미한 자음/모음 나열(예: 'ㅋㅋㅋ', 'asdfghj', 'ㅇㅇㅇ'), 또는 책과 전혀 무관한 장난인 경우:
     * isAppropriate 를 false 로 설정하세요.
     * friendlyFeedback 에 초등학생 눈높이에 맞춘 정중하고 부드러운 재작성 권유 메시지를 남기세요.
     * 절대 학생을 혼내거나 딱딱하게 말하지 말고, "책 이야기와 기억에 남는 장면을 정성껏 다시 적어 줄래요? 어떤 책인지 알려 주면 멋진 생각 질문을 선물해 줄게요! 📚😊" 처럼 따뜻하게 격려하세요.
     * cards 배열은 빈 배열([])로 두세요.

2. 적절한 입력인 경우 (isAppropriate = true):
   - friendlyFeedback: 책과 장면에 대한 따뜻한 맞장구와 칭찬 1~2문장 (예: "『샬롯의 거미줄』을 읽었군요! 윌버와 샬롯의 우정은 정말 잊지 못할 명장면이지요.")
   - 정확히 3장의 카드를 생성하세요:
     1) fact (사실 확인 카드):
        - 이야기 속에서 실제로 일어난 일, 사건의 전개, 상황, 인물의 행동이나 배경을 되짚어보는 질문.
        - [필수 규칙] 질문은 반드시 '단 한 문장'이어야 합니다.
        - [필수 규칙] 초등 4~6학년이 이해하기 쉬운 단어를 사용하세요.
        - [필수 규칙] 절대 답을 알려 주지 말고 오직 질문만 하세요!
        - hint (생각을 돕는 힌트): 카드를 뒤집었을 때 학생이 스스로 생각할 수 있도록 방향을 잡아 주는 다정한 안내 (1~2문장, 답을 직접 주지 않고 기억을 떠올리는 단서 제공).
        - starter (생각 시작 문장): 학생이 답변을 적기 시작하기 편하도록 돕는 문장 시작말 (예: "주인공이 그곳에 갔을 때...").

     2) emotion (인물 마음 추측 카드):
        - 그 장면에서 등장인물이 어떤 감정(기쁨, 두려움, 외로움, 고마움, 억울함 등)을 느꼈을지, 속마음이나 행동의 까닭을 상상해보는 질문.
        - [필수 규칙] 질문은 반드시 '단 한 문장'이어야 합니다.
        - [필수 규칙] 쉬운 단어와 공감하는 어투를 사용하세요.
        - [필수 규칙] 절대 답을 미리 말하지 마세요.
        - hint: 등장인물의 표정, 말, 처한 입장을 상상해보도록 이끄는 힌트 (1~2문장).
        - starter (생각 시작 문장): (예: "그 순간 주인공은 ~한 마음이었을 것 같아요, 왜냐하면...").

     3) connection (나와 연결하기 카드):
        - 책 속의 상황이나 인물의 고민을 '학생 자신의 삶, 경험, 주변 사람, 내가 만약 주인공이었다면 어땠을지'와 연결하여 깊이 생각해보는 질문.
        - [필수 규칙] 질문은 반드시 '단 한 문장'이어야 합니다.
        - [필수 규칙] 쉬운 단어, 호기심을 자극하는 다정한 질문.
        - [필수 규칙] 정답이 없는 열린 질문이어야 합니다.
        - hint: 학생이 자신의 일상이나 겪었던 비슷한 일을 떠올릴 수 있도록 돕는 힌트 (1~2문장).
        - starter (생각 시작 문장): (예: "나에게도 비슷한 일이 있었는데, 그때 나는...").
`;

    const userPrompt = `
[학생이 쓴 내용]
- 책 제목: ${trimmedTitle}
- 인상 깊은 장면: ${trimmedScene}

위 내용을 꼼꼼히 살피고, 초등 4~6학년 학생을 위해 깊은 생각과 성장을 이끌어 주는 질문 카드 3장을 완성해 주세요.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAppropriate: {
              type: Type.BOOLEAN,
              description: 'Whether the input is appropriate and relevant to a book/reading',
            },
            friendlyFeedback: {
              type: Type.STRING,
              description: 'Gentle feedback or encouragement for the student in Korean',
            },
            cards: {
              type: Type.ARRAY,
              description: 'The 3 thinking question cards',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: {
                    type: Type.STRING,
                    description: 'Unique card ID (e.g. card-fact, card-emotion, card-connection)',
                  },
                  type: {
                    type: Type.STRING,
                    description: 'One of fact, emotion, connection',
                  },
                  title: {
                    type: Type.STRING,
                    description: 'Card title (e.g. 사실 확인 카드, 인물 마음 카드, 나와 연결하기 카드)',
                  },
                  subtitle: {
                    type: Type.STRING,
                    description: 'Short helper subtitle in Korean',
                  },
                  question: {
                    type: Type.STRING,
                    description: 'Single-sentence question in easy Korean words without giving the answer',
                  },
                  hint: {
                    type: Type.STRING,
                    description: 'Thought-provoking hint revealed when card is flipped (1-2 sentences)',
                  },
                  starter: {
                    type: Type.STRING,
                    description: 'Sentence starter to help the student begin answering',
                  },
                },
                required: ['id', 'type', 'title', 'subtitle', 'question', 'hint', 'starter'],
              },
            },
          },
          required: ['isAppropriate', 'friendlyFeedback', 'cards'],
        },
      },
    });

    const rawText = response.text || '{}';
    const parsedData = JSON.parse(rawText);

    // Note: We do not save or log student input or output. Completely stateless.
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating reading cards:', error);
    return res.status(500).json({
      isAppropriate: false,
      friendlyFeedback: '질문 카드를 만드는 중에 작은 문제가 생겼어요. 잠시 후에 다시 시도해 줄래요? 📚',
      cards: [],
      error: error?.message || 'Internal server error',
    });
  }
});

// Dev / Prod Vite serving
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
