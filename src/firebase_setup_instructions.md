# Guia de Configuração do Firebase (Plano Spark 100% Gratuito, Sem Cartão)

Este guia ensina como configurar o banco de dados e a autenticação em nuvem para o aplicativo **JS75: Próxima Fase** usando o plano gratuito do Firebase (Spark), sem a necessidade de adicionar um cartão de crédito.

---

## 1. Criar o Projeto no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/).
2. Clique em **Adicionar projeto** (Add project).
3. Insira o nome do seu projeto (ex: `js75-proxima-fase`).
4. Ative ou desative o Google Analytics (recomendado desativar para maior rapidez) e conclua a criação.

---

## 2. Ativar Firebase Authentication (Anônimo)

O login anônimo permite gerar um UID exclusivo e seguro para cada jogador sem exigir senhas ou e-mails, mantendo a privacidade total.

1. No menu lateral esquerdo do Firebase Console, acesse **Build > Authentication** (Construção > Autenticação).
2. Clique em **Começar** (Get Started).
3. Vá na aba **Sign-in method** (Método de login).
4. Sob a lista de provedores, clique em **Anônimo** (Anonymous).
5. Ative a chave de ativação (Status: Ativado) e clique em **Salvar** (Save).

---

## 3. Criar Firestore Database

Usaremos o Firestore para guardar o progresso e o avatar leve comprimido em base64 sob a coleção `players`.

1. No menu lateral, acesse **Build > Firestore Database**.
2. Clique em **Criar banco de dados** (Create database).
3. Selecione o **Modo de Produção** (Production Mode) para garantir regras de segurança rígidas.
4. Escolha a localização geográfica do seu servidor (ex: `southamerica-east1` para o Brasil ou `us-east1` para os EUA) e clique em **Próximo > Ativar**.
5. Vá na aba **Regras** (Rules) do Firestore Database, copie e cole as regras a seguir para garantir que cada usuário autenticado possa ler e escrever apenas os seus próprios dados:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Bloqueio de segurança geral
    match /{document=**} {
      allow read, write: if false;
    }

    // Cada jogador lê e escreve exclusivamente seu próprio UID
    match /players/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. Clique em **Publicar** (Publish).

---

## 4. Obter as Credenciais e Configurar Variáveis de Ambiente

Para o app se conectar ao seu banco de dados grátis, obtenha as chaves de API:

1. No painel principal do Firebase, clique no ícone de **Engrenagem** (Configurações do Projeto) > **Configurações do projeto**.
2. Na aba **Geral**, role até a seção **Seus aplicativos** e clique no ícone **Web (`</>`)**.
3. Registre o app com um apelido (ex: `js75-web`) e clique em **Registrar app**.
4. Copie as chaves do objeto `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789...",
  appId: "1:123456789..."
};
```

5. No seu ambiente de desenvolvimento, crie ou altere o arquivo `.env` local para definir estas chaves usando o prefixo `VITE_` (usado pelo Vite para segurança no cliente):

```env
VITE_FIREBASE_API_KEY="SUA_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="SEU_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="SEU_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="SEU_APP_ID"
```

---

## 5. Como Funciona a Compressão Automática de Imagem

O aplicativo foi projetado para contornar qualquer limite de armazenamento sem exigir custos:
* A foto de perfil do jogador (avatar) enviada no upload é imediatamente **redimensionada para no máximo 300x300px** no navegador do cliente usando elementos do HTML5 Canvas.
* A qualidade é reduzida para **JPEG 0.6**, resultando em uma string Base64 extremamente otimizada (geralmente **entre 10KB e 25KB**).
* Essa string é salva de forma integrada no documento Firestore do jogador, mantendo o uso de dados e de armazenamento bem abaixo da cota gratuita diária do plano Spark (50.000 leituras e 20.000 escritas diárias).
