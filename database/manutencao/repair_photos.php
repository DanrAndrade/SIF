<?php
/**
 * Para cada team_member sem photo_url, tenta restaurar com a foto
 * que estava na pagina estatica (matching por name + group_name).
 */
require_once 'db.php';
header('Content-Type: application/json');

$staticTeam = [
  // Diretoria
  ['Diretoria', 'Gilciano',  'Gilciano - Diretor Geral Fundação SIF.jpg'],
  ['Diretoria', 'Gleison',   'Gleison - Diretor Geral EMBRAPII  e Diretor Cientifico SIF.jpg'],
  ['Diretoria', 'Gumercindo','Gumercindo - Diretor Geral da SIF.png'],
  ['Diretoria', 'Michele Brandão', 'Michele Brandão  - Gerente Executiva.jpg'],
  // Coordenadoras
  ['Coordenadoras', 'Camila',  'Camila - Coord. Produtos e Serviços.png'],
  ['Coordenadoras', 'Cintia',  'Cintia - Coord da Fudação SIF e EMBRAPII.png'],
  ['Coordenadoras', 'Helen',   'Helen  - Coord de Inovação e Projetos.png'],
  ['Coordenadoras', 'Larissa', 'Larissa  - Coord. de CSC.png'],
  ['Coordenadoras', 'Ângela Silva', 'Ângela Silva - Coord. de Rh e Faciliities.png'],
  // Coord. Fundação SIF & EMBRAPII
  ['Coord. Fundação SIF & EMBRAPII', 'Flávia',        'Flávia - Estagiária.png'],
  ['Coord. Fundação SIF & EMBRAPII', 'Gabriela Camilo','Gabriela Camilo - Gestora de Convênios.png'],
  ['Coord. Fundação SIF & EMBRAPII', 'Otávio Silveira','Otávio Silveira - Estagiário.png'],
  // Coord. Inovação e Projetos
  ['Coord. Inovação e Projetos', 'Tamara Braga',     'Tamara Braga - Analista de Inovação.png'],
  ['Coord. Inovação e Projetos', 'Thamires Carvalho','Thamires Carvalho - Analista de Proejtos.png'],
  // Coord. de CSC
  ['Coord. de CSC', 'Adilson Abranches','Adilson Abranches - Informática.png'],
  ['Coord. de CSC', 'Joyce Aquino',     'Joyce Aquino - Contratos Internos.png'],
  ['Coord. de CSC', 'Kellen Souza',     'Kellen Souza - Compras.png'],
  ['Coord. de CSC', 'Lidiane Heleno',   'Lidiane Heleno - Contas a Pagar.png'],
  ['Coord. de CSC', 'Mauricio Seiffer', 'Mauricio Seiffer - Estagiário.png'],
  ['Coord. de CSC', 'Rafaela Vilar',    'Rafaela Vilar - Contas a Receber.png'],
  ['Coord. de CSC', 'Silmara Pena',     'Silmara Pena  - Controle Financeiro.png'],
  // Coord. de Produtos e Serviços
  ['Coord. de Produtos e Serviços', 'Angelina Melo',    'Angelina Melo - GT Sociedade.png'],
  ['Coord. de Produtos e Serviços', 'Giovanna Oliveira','Giovanna Oliveira - GT Colheita e Logística.png'],
  ['Coord. de Produtos e Serviços', 'Juliana Melo',     'Juliana Melo - GT Carvão Vegetal.png'],
  ['Coord. de Produtos e Serviços', 'Laís Luz',         'Laís Luz - Analista de Eventos.png'],
  ['Coord. de Produtos e Serviços', 'Lucas Sousa',      'Lucas Sousa - Assistente de Comunicação e Marketing.png'],
  ['Coord. de Produtos e Serviços', 'Mateus Costa',     'Mateus Costa - Analista de Comunicação e Marketing.png'],
  ['Coord. de Produtos e Serviços', 'Mirian Valente',   'Mirian Valente - GT Restauração.png'],
  ['Coord. de Produtos e Serviços', 'Nathália Ramos',   'Nathália Ramos - GT Bambu.png'],
  ['Coord. de Produtos e Serviços', 'Otávio Fernandes', 'Otávio Fernandes - GT Segurança.png'],
  ['Coord. de Produtos e Serviços', 'Pedro Almada',     'Pedro Almada - Analista Comercial.png'],
  ['Coord. de Produtos e Serviços', 'Samuel Souza',     'Samuel Souza - GT Ferroligas.png'],
  ['Coord. de Produtos e Serviços', 'Silas Sardinha',   'Silas Sardinha - GT Manejo.png'],
  // Coord. de RH & Facilities
  ['Coord. de RH & Facilities', 'Adão Vitorio',      'Adão Vitorio - Recepção.png'],
  ['Coord. de RH & Facilities', 'Ana Clarisse',      'Ana Clarisse - Estagiária.png'],
  ['Coord. de RH & Facilities', 'Maria Auxiliadora', 'Maria Auxiliadora - Serviços Gerais.png'],
  ['Coord. de RH & Facilities', 'Monalisa Meireles', 'Monalisa Meireles - Estagiária.png'],
  ['Coord. de RH & Facilities', 'Roberta Finamore',  'Roberta Finamore - Formação de RH.jpg'],
  ['Coord. de RH & Facilities', 'Samara Soares',     'Samara Soares - Analista de RH.png'],
  // Consultores
  ['Consultores', 'Andreia', 'Andreia - Organizacional.jpg'],
  ['Consultores', 'Marinês', 'Marinês - Juridico.jpg'],
  ['Consultores', 'Rômulo',  'Rômulo - Contábil.png'],
];

$folderMap = [
  'Diretoria' => 'Diretoria',
  'Coordenadoras' => 'Coordenadoras',
  'Coord. Fundação SIF & EMBRAPII' => 'Coordenações/Coord. Fundação SIF e EMBRAPII',
  'Coord. Inovação e Projetos'     => 'Coordenações/Coordenação Inovação e Projetos',
  'Coord. de CSC'                  => 'Coordenações/Coordenação de CSC',
  'Coord. de Produtos e Serviços'  => 'Coordenações/Coordenação de Produtos e Serviços',
  'Coord. de RH & Facilities'      => 'Coordenações/Coordenação de RH',
  'Consultores'                    => 'Consultores',
];

$repaired = [];
foreach ($staticTeam as [$group, $name, $file]) {
    $folder = $folderMap[$group];
    $photoUrl = '/nossa-gente/' . $folder . '/' . $file;
    // Restaura SOMENTE se o membro existe e não tem foto
    $stmt = $pdo->prepare("UPDATE team_members SET photo_url = ? WHERE name = ? AND group_name = ? AND (photo_url IS NULL OR photo_url = '')");
    $stmt->execute([$photoUrl, $name, $group]);
    if ($stmt->rowCount() > 0) $repaired[] = "$name ($group)";
}

echo json_encode(['repaired' => count($repaired), 'members' => $repaired], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
