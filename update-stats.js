const fs = require('fs');

async function updateRPGStats() {
  const username = 'SnuflyNoctis';
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) throw new Error('Falha ao buscar dados do GitHub');
    const data = await response.json();

    const repos = data.public_repos;
    const followers = data.followers;

    const totalXP = (repos * 150) + (followers * 50);
    
    const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;
    
    const currentLevelXP = Math.pow(level - 1, 2) * 100;
    const nextLevelXP = Math.pow(level, 2) * 100;
    const xpInCurrentLevel = totalXP - currentLevelXP;
    const xpRequiredForNextLevel = nextLevelXP - currentLevelXP;
    
    const progressPercent = Math.min(Math.floor((xpInCurrentLevel / xpRequiredForNextLevel) * 100), 100);

    const progressBarLength = 15;
    const filledLength = Math.round((progressBarLength * progressPercent) || 0 / 100);
    const progressBar = '▓'.repeat(filledLength) + '░'.repeat(progressBarLength - filledLength);

    const rmarkdown = `
### Character Status: João Victor
- **Class:** Front-end Mage 🔮 *(Three.js & UI/UX Specialty)*
- **Level:** \`Lv. ${level}\`
- **Exp Points:** \`${totalXP} XP\`
- **Next Level:** \`[${progressBar}] ${progressPercent}%\`

#### Current Inventory Stats
- **Artifacts Created (Public Repos):** \`${repos}\`
- **Party Members (Followers):** \`${followers}\`
*Last updated: ${new Date().toLocaleDateString('pt-BR')}*
`;

    const readmePath = './README.md';
    let readmeContent = fs.readFileSync(readmePath, 'utf8');

    const startTag = '';
    const endTag = '';

    const startIndex = readmeContent.indexOf(startTag);
    const endIndex = readmeContent.indexOf(endTag);

    if (startIndex === -1 || endIndex === -1) {
      console.error('Tags de comentário não encontradas no README.md');
      return;
    }

    const newReadmeContent = 
      readmeContent.substring(0, startIndex + startTag.length) + 
      rmarkdown + 
      readmeContent.substring(endIndex);

    fs.writeFileSync(readmePath, newReadmeContent);
    console.log('Status do RPG atualizado com sucesso!');

  } catch (error) {
    console.error('Erro ao atualizar o status:', error);
  }
}

updateRPGStats();
