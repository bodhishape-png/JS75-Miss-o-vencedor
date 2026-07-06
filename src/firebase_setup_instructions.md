# Guia de Configuração do Firebase para JS75: Próxima Fase

Caso queira migrar o aplicativo para salvar dados na nuvem em tempo real (Firebase), siga este guia passo a passo gratuito.

## 1. Criar Projeto no Firebase
1. Acesse o [Console do Firebase](https://console.firebase.google.com/).
2. Clique em **Adicionar projeto** e dê um nome (ex: `js75-proxima-fase`).
3. Ative ou desative o Google Analytics (opcional) e conclua a criação do projeto.

## 2. Ativar Firebase Authentication (Anônimo)
1. No menu lateral, acesse **Build > Authentication**.
2. Clique em **Começar** (Get Started).
3. Vá na aba **Sign-in method** (Método de login).
4. Clique em **Anônimo** (Anonymous), ative a chave e clique em **Salvar**.

## 3. Criar Firestore Database (Banco de Dados)
1. No menu lateral, acesse **Build > Firestore Database**.
2. Clique em **Criar banco de dados**.
3. Escolha as regras de segurança em **Modo de Produção** ou **Modo de Teste**.
4. Defina a localização geográfica ideal (ex: `us-east1` ou `southamerica-east1` para o Brasil) e ative.
5. Em **Regras** (Rules), defina as regras adequadas para permitir leitura e escrita do usuário autenticado:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /players/{playerId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## 4. Criar Firebase Storage (Armazenamento de Fotos)
1. No menu lateral, acesse **Build > Storage**.
2. Clique em **Começar**, defina a localização e conclua.
3. Altere as regras para permitir fotos de perfil anônimas:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /avatars/{userId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## 5. Configurar `firebaseConfig` no Código
Crie um arquivo chamado `firebase.js` na raiz da pasta `src/` com suas credenciais obtidas nas configurações do projeto Firebase (ícone de Engrenagem > Configurações do Projeto > Seus Aplicativos > Adicionar Web App):

```javascript
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SUA_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

## 6. Publicar no Firebase Hosting (Gratuito)
1. Instale a ferramenta CLI do Firebase:
   ```bash
   npm install -g firebase-tools
   ```
2. Faça login e configure o projeto:
   ```bash
   firebase login
   firebase init
   ```
   *Selecione **Hosting** e associe ao projeto criado.*
   *Defina o diretório público de deploy como `dist`.*
   *Configure como Single Page Application (SPA): **Yes**.*
3. Faça o build do projeto React:
   ```bash
   npm run build
   ```
4. Publique:
   ```bash
   firebase deploy
   ```
