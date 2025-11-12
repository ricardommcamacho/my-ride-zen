// Portuguese translations
export const translations = {
  // App general
  app: {
    name: "VehiclePulse",
    tagline: "Manage your vehicle with ease"
  },
  // Index page
  index: {
    noVehicles: "Nenhum veículo ainda"
  },
  // Documents page
  documents: {
    title: 'Documentos',
    subtitle: 'Gerencie os documentos do seu veículo',
    allVehicles: 'Todos os Veículos',
    searchPlaceholder: 'Pesquisar documentos...',
    all: 'Todos',
    insurance: 'Seguro',
    registration: 'Registo',
    noDocuments: 'Nenhum documento ainda',
    uploadFirst: 'Carregue o seu primeiro documento para começar',
    uploadButton: 'Carregar Documento',
    expires: 'Expira',
    uploadInDevelopment: 'Carregamento em desenvolvimento',
    filesSelected: '{count} ficheiros selecionados'
  },
  stats: {
    title: 'Estatísticas',
    subtitle: 'Acompanhe as despesas do seu veículo',
    selectVehicle: 'Selecione um veículo',
    totalSpent: 'Total Gasto',
    fuel: 'Combustível',
    maintenance: 'Manutenção',
    avgConsumption: 'Consumo Médio',
    lPer100km: 'L/100km',
    recentTransactions: 'Transações Recentes',
    noTransactions: 'Ainda não há transações. Comece a acompanhar as suas despesas!',
    fuelRefill: 'Abastecimento'
  },
  settings: {
    title: 'Definições',
    subtitle: 'Gerencie a sua conta e preferências',
    profile: 'Perfil',
    profileDescription: 'Informações da sua conta',
    email: 'Email',
    about: 'Sobre',
    version: 'Versão',
    appName: 'Nome da Aplicação',
    signOut: 'Sair',
    signedOut: 'Sessão terminada com sucesso'
  },
  addVehicleModal: {
    title: 'Adicionar o seu Primeiro Veículo',
    subtitle: 'Vamos começar adicionando os detalhes do seu veículo',
    brand: 'Marca',
    brandPlaceholder: 'ex: Toyota',
    model: 'Modelo',
    modelPlaceholder: 'ex: Corolla',
    year: 'Ano',
    plate: 'Matrícula',
    platePlaceholder: '00-AA-00',
    type: 'Tipo',
    fuelType: 'Tipo de Combustível',
    car: 'Carro',
    motorcycle: 'Motociclo',
    electric: 'Elétrico',
    gasoline: 'Gasolina',
    diesel: 'Diesel',
    hybrid: 'Híbrido',
    lpg: 'GPL',
    cancel: 'Cancelar',
    adding: 'Adicionando...',
    addVehicle: 'Adicionar Veículo'
  },
  // Log Service Modal
  logServiceModal: {
    title: "Registrar Serviço",
    pleaseSelectVehicle: "Por favor, selecione um veículo",
    maintenanceLogAdded: "Registo de manutenção adicionado com sucesso",
    failedToAddMaintenanceLog: "Falha ao adicionar registo de manutenção",
    vehicle: "Veículo *",
    selectVehicle: "Selecionar veículo",
    serviceDate: "Data do Serviço *",
    type: "Tipo *",
    description: "Descrição *",
    descriptionPlaceholder: "ex: Trocado óleo do motor e filtro",
    cost: "Custo (€)",
    costPlaceholder: "85.00",
    odometer: "Odómetro (km) *",
    odometerPlaceholder: "45230",
    serviceProvider: "Prestador de Serviço",
    serviceProviderPlaceholder: "ex: AutoService Pro",
    nextServiceDate: "Próxima Data de Serviço",
    pickADate: "Escolher uma data",
    nextServiceOdometer: "Próximo Odómetro de Serviço (km)",
    nextServiceOdometerPlaceholder: "50000",
    notes: "Notas",
    notesPlaceholder: "Notas adicionais...",
    cancel: "Cancelar",
    adding: "Adicionando...",
    addService: "Adicionar Serviço",
    oilChange: "Troca de Óleo",
    tireRotation: "Rotação de Pneus",
    brakeService: "Serviço de Travões",
    batteryReplacement: "Substituição de Bateria",
    inspection: "Inspeção",
    repair: "Reparação",
    other: "Outro"
  },
  // Add Fuel Modal
  addFuelModal: {
    title: 'Adicionar Registo de Combustível',
    selectVehicle: 'Selecionar veículo',
    date: 'Data',
    quantity: 'Quantidade (L)',
    pricePerLiter: 'Preço/L (€)',
    totalCost: 'Custo Total (€)',
    odometer: 'Odómetro (km)',
    fullTankRefill: 'Abastecimento Completo',
    stationName: 'Nome do Posto',
    stationPlaceholder: 'ex: BP, Shell',
    location: 'Localização',
    locationPlaceholder: 'Cidade ou endereço',
    notes: 'Notas',
    notesPlaceholder: 'Notas adicionais...',
    cancel: 'Cancelar',
    adding: 'A adicionar...',
    addRecord: 'Adicionar Registo',
    pleaseSelectVehicle: 'Por favor, selecione um veículo',
    fuelRecordAdded: 'Registo de combustível adicionado com sucesso',
    failedToAddRecord: 'Falha ao adicionar registo de combustível'
  },
  uploadDocumentModal: {
    title: "Carregar Documento",
    fileSizeError: "O tamanho do arquivo deve ser menor que 10MB",
    pleaseSelectFile: "Por favor, selecione um arquivo",
    pleaseSelectVehicle: "Por favor, selecione um veículo",
    documentUploaded: "Documento carregado com sucesso",
    failedToUpload: "Falha ao carregar documento",
    file: "Arquivo *",
    clickToUpload: "Clique para carregar ou arraste e solte",
    fileTypes: "PDF, JPG, PNG (máx 10MB)",
    documentTitle: "Título *",
    titlePlaceholder: "ex: Certificado de Seguro 2024",
    type: "Tipo *",
    insurance: "Seguro",
    registration: "Registro",
    inspection: "Inspeção",
    warranty: "Garantia",
    invoice: "Fatura",
    other: "Outro",
    vehicle: "Veículo *",
    selectVehicle: "Selecionar veículo",
    expiryDate: "Data de Validade (Opcional)",
    pickDate: "Selecionar data",
    notes: "Notas (Opcional)",
    notesPlaceholder: "Notas adicionais...",
    cancel: "Cancelar",
    uploading: "Carregando...",
    upload: "Carregar"
  },
  editDocumentModal: {
    title: "Editar Documento",
    documentUpdated: "Documento atualizado com sucesso",
    failedToUpdate: "Falha ao atualizar documento",
    documentTitle: "Título *",
    titlePlaceholder: "ex: Certificado de Seguro 2024",
    type: "Tipo *",
    insurance: "Seguro",
    registration: "Registro",
    inspection: "Inspeção",
    warranty: "Garantia",
    invoice: "Fatura",
    other: "Outro",
    vehicle: "Veículo *",
    selectVehicle: "Selecionar veículo",
    expiryDate: "Data de Validade (Opcional)",
    pickDate: "Selecionar data",
    notes: "Notas (Opcional)",
    notesPlaceholder: "Notas adicionais...",
    cancel: "Cancelar",
    saving: "A guardar...",
    saveChanges: "Guardar Alterações"
  },
  alertBanner: {
    dueSoon: "Vence em Breve",
    expiresIn: "Expira em",
    day: "dia",
    days: "dias",
    more: "+{count} mais"
  },
  quickActions: {
    addFuel: "Adicionar Combustível",
    logService: "Registrar Serviço"
  },
  monthlySummary: {
    thisMonth: "Este Mês",
    totalSpent: "Total Gasto",
    avgConsumption: "Cons. Médio",
    vsLastMonth: "vs mês passado",
    budgetUsed: "do orçamento mensal utilizado"
  },
  upcomingTimeline: {
    upcoming: "Próximos",
    noUpcomingEvents: "Nenhum evento próximo nos próximos 60 dias",
    expires: "expira"
  },
  recentActivity: {
    recentActivity: "Atividade Recente",
    noActivity: "Nenhuma atividade ainda. Comece adicionando registos de combustível ou manutenção!",
    fuel: "Combustível",
    uploaded: "carregado"
  },
  bottomNav: {
    home: "Início",
    docs: "Documentos",
    stats: "Estatísticas",
    more: "Mais"
  },
  documentCard: {
    expired: "Expirado",
    expiresIn: "Expira em",
    view: "Ver",
    download: "Descarregar",
    edit: "Editar",
    delete: "Eliminar",
    expires: "Expira em"
  }
};

// Translation function
export const t = (key: string): string => {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};