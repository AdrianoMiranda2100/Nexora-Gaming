import express from 'express';
import path from 'path';

const baseDir = import.meta.dirname;
const app = express();
const PORT = process.env.PORT || 3000;

// Pastas do projeto
const publicDirectory = path.join(baseDir, 'src', 'public');
const pagesDirectory = path.join(publicDirectory, 'paginas');

// Disponibiliza CSS, JavaScript e imagens em /css, /js e /images.
app.use(express.static(publicDirectory));

// Cada rota entrega um arquivo HTML separado.
const pages = {
  '/': 'index.html',
  '/produtos': 'produtos.html',
  '/categorias': 'categorias.html',
  '/ofertas': 'ofertas.html',
  '/jogos': 'jogos.html',
  '/sobre': 'sobre.html',
  '/suporte': 'suporte.html',
  '/contato': 'contato.html',
  '/carrinho': 'carrinho.html',
  '/favoritos': 'favoritos.html',
  '/setup': 'setup.html',
  '/produto': 'produto.html'
};

for (const [route, fileName] of Object.entries(pages)) {
  app.get(route, (req, res, next) => {
    res.sendFile(path.join(pagesDirectory, fileName), (error) => {
      if (error) next(error);
    });
  });
}

// Resposta personalizada para rotas inexistentes.
app.use((req, res) => {
  res.status(404).sendFile(path.join(pagesDirectory, '404.html'), (error) => {
    if (error) {
      res.status(404).type('text/plain').send('Página não encontrada.');
    }
  });
});

app.listen(PORT, () => {
  console.log('================================');
  console.log('NEXORA GAMING');
  console.log(`Servidor: http://localhost:${PORT}`);
  console.log('Rotas carregadas:');
  console.log('/ | /produtos | /categorias');
  console.log('/ofertas | /jogos | /sobre');
  console.log('/suporte | /contato | /carrinho');
  console.log('/favoritos | /setup | /produto');
  console.log('================================');
});
