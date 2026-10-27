const fs = require('fs');

async function updateSaveRoomStats() {
  const username = 'SnuflyNoctis';
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) throw new Error('Falha ao buscar dados do GitHub');
    const data = await response.json();

    const repos = data.public_repos;
    const followers = data.followers;

    // Lógica para definir a "Condição" (Vida) baseada em atividade (exemplo com repositórios)
    let condition = '🟩 Fine';
    if (repos > 30) condition = '🟩 Fine (Optimal)';
    else if (repos > 15) condition = '🟨 Caution';
    else condition = '🟥 Danger';

    const saveFileContent = `
### 📼 Typewriter - Save Data
> *"Is that you, survivor?"*

- **Player ID:** João Victor
- **Current Location:** Front-end R&D Labs 🧪
- **Condition:** \`${condition}\`
- **Ink Ribbons Used (Commits/Repos):** \`${repos}\`
- **Allies Encountered (Followers):** \`${followers}\`
- **Specialty Weapon:** \`React.js & Three.js\`

*Last saved at: ${new Date().toLocaleString('pt-BR')}*
`;

    const readmePath = './README.md';
    let readmeContent = fs.readFileSync(readmePath, 'utf8');

    // Tags que devem existir no seu README.md
    const startTag = '<!-- SAVE_START -->';
    const endTag = '<!-- SAVE_END -->';

    const startIndex = readmeContent.indexOf(startTag);
    const endIndex = readmeContent.indexOf(endTag);

    if (startIndex === -1 || endIndex === -1) {
      console.error('Tags de comentário não encontradas no README.md');
      return;
    }

    const newReadmeContent = 
      readmeContent.substring(0, startIndex + startTag.length) + 
      '\n' + saveFileContent + '\n' +
      readmeContent.substring(endIndex);

    fs.writeFileSync(readmePath, newReadmeContent);
    console.log('Save Room atualizado com sucesso!');

  } catch (error) {
    console.error('Erro ao atualizar o save:', error);
  }
}

updateSaveRoomStats();
