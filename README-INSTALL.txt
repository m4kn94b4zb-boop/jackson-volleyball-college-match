RECRUITING AI EMAIL FILES - INSTALL STEPS

1. Put this file into your project:
   api/generate-recruiting-email.js

   It should go in an api folder at the main project level, NOT inside src.

2. Put this file into your project:
   src/lib/generateRecruitingEmail.js

   If you do not have a lib folder inside src, create one.

3. In your project terminal, run:
   npm install openai

4. In Vercel, add this Environment Variable:
   Name: OPENAI_API_KEY
   Value: your OpenAI API key

5. Redeploy the Vercel project after adding the key.

IMPORTANT:
Never put your OpenAI API key inside App.jsx, GitHub, or any frontend file.
