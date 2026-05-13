import { useState } from 'react';
import { AppWindow, Users, Share2, MessageCircle, Bot, Send, AlertTriangle, Clock, Bell, UserPlus, Settings, FileText, CheckCircle2, Plus, MessageSquare, FileSpreadsheet, FileImage, FileCode, Search, Wrench, X, Database, Upload, Link, ChevronDown, Hand, Table, Webhook, FileCheck, Book, Zap, Sparkles, Loader2 } from 'lucide-react';

const tabs = [
  { id: 'app-info', label: '应用信息', icon: AppWindow },
  { id: 'virtual-colleagues', label: '虚拟同事', icon: Users },
  { id: 'my-hypergraph', label: '我的超图', icon: Share2 },
  { id: 'qa', label: '问答', icon: MessageCircle },
];

const apps = [
  { id: 'inventory', name: '库存预警', badge: 3 },
  { id: 'fulfillment', name: '履约超期预警', badge: 5 },
];

const colleagues = [
  { id: 'sales-mei', name: '销售小美', role: '销售专员', avatar: 'bg-pink-100 text-pink-600' },
  { id: 'purchasing-jie', name: '采购阿杰', role: '采购专员', avatar: 'bg-blue-100 text-blue-600' },
];

interface MockMessage {
  id: number;
  title: string;
  time: string;
  content: string;
  level: 'high' | 'critical' | 'medium' | 'info';
  read: boolean;
}

const mockMessages: Record<string, MockMessage[]> = {
  'inventory': [
    { id: 1, title: '商品A库存低于安全阈值', time: '10分钟前', content: '当前库存: 15件，安全阈值: 50件。请及时补货。', level: 'high', read: false },
    { id: 2, title: '商品B库存告警', time: '1小时前', content: '当前库存: 5件，安全阈值: 20件。已自动触发采购申请。', level: 'critical', read: false },
    { id: 3, title: '华东仓总体库存利用率偏高', time: '昨天 15:30', content: '华东仓当前库位利用率已达85%，请注意库位调拨。', level: 'medium', read: false },
    { id: 4, title: '商品C库存已补充', time: '昨天 10:00', content: '入库单 #IN20231024 已完成，商品C当前库存: 200件。', level: 'info', read: true },
  ],
  'fulfillment': [
    { id: 1, title: '订单 #ORD-001 履约即将超时', time: '5分钟前', content: '该订单承诺发货时间剩余不到2小时，当前状态：拣货中。', level: 'high', read: false },
    { id: 2, title: '大客户订单 #ORD-089 延误风险', time: '30分钟前', content: '由于缺货，该订单预计将延误24小时发货。', level: 'critical', read: false },
    { id: 3, title: '5个普通订单已超时', time: '2小时前', content: '请在履约中心查看详细列表并手动干预。', level: 'high', read: false },
    { id: 4, title: '物流异常: 华南地区', time: '昨天 16:45', content: '受天气影响，华南地区30个订单配送可能延迟。', level: 'medium', read: false },
    { id: 5, title: '履约完成率日报', time: '昨天 08:00', content: '昨日整体履约完成率 98.5%，达标。', level: 'info', read: false },
  ]
};

const qaHistory = [
  { id: 'qa-1', title: '合同SCJSD20190321-FZ01确认收货排查', time: '刚刚' },
  { id: 'qa-2', title: '库存预警规则调整咨询', time: '2小时前' },
  { id: 'qa-3', title: '上个月履约超时原因排查', time: '昨天' },
  { id: 'qa-4', title: '新供应商接入流程', time: '前天' },
];

const qaWorkspaceFiles = [
  { id: 'file-1', name: 'human_readable.json', type: 'code', size: '3.4 KB' },
  { id: 'file-2', name: 'reverse_analysis.py', type: 'code', size: '2.1 KB' },
  { id: 'file-3', name: 'nodes_data.json', type: 'code', size: '15.6 KB' },
  { id: 'file-4', name: 'sales_order_SOPB.csv', type: 'excel', size: '4.2 KB' },
];

const agentTraces = [
  { id: 't-1', type: 'assistant', title: 'Thought', content: '用户询问合同 SCJSD20190321-FZ01 为什么没有确认收货，我需要先提取该合同相关的所有节点数据。' },
  { id: 't-2', type: 'tool', title: 'Call Tool: table_ontology_data_access', content: '{"start_node":"sales_contracts", "condition":{"contract_code":"SCJSD20190321-FZ01"}}', status: 'success' },
  { id: 't-3', type: 'assistant', title: 'Thought', content: '获取到相关数据，现在我需要执行反向分析脚本来定位阻塞节点。' },
  { id: 't-4', type: 'tool', title: 'Call Tool: execute_python_script', content: '{"script_name":"reverse_analysis.py", "args":["SCJSD20190321-FZ01"]}', status: 'success' },
  { id: 't-5', type: 'assistant', title: 'Thought', content: '接下来检查发货申请和履约状态详情。' },
  { id: 't-6', type: 'tool', title: 'Call Tool: execute_python_script', content: '{"script_name":"of_status.py", "args":["SCJSD20190321-FZ01"]}', status: 'success' },
  { id: 't-7', type: 'assistant', title: 'Thought', content: '所有分析完成，我将读取最终生成的可读分析报告呈现给用户。' },
  { id: 't-8', type: 'tool', title: 'Call Tool: file_terminal', content: '{"command":"cat", "args":["contract_SCJSD20190321-FZ01/human_readable.json"]}', status: 'success' },
];

const governanceItems = [
  { id: 'doc', label: '文档', icon: FileText, desc: '上传非结构化业务文档以解析业务知识' },
  { id: 'db', label: '数据库', icon: Database, desc: '配置关系型或非关系型数据库连接' },
  { id: 'table', label: '自定义表', icon: Table, desc: '手动定义或导入Excel/CSV数据表' },
  { id: 'api', label: 'API工具', icon: Webhook, desc: '注册外部系统接口器或集成服务' },
  { id: 'rule', label: '业务规则', icon: FileCheck, desc: '配置业务流转与逻辑验证规则' },
  { id: 'term', label: '术语库', icon: Book, desc: '统一企业内部业务名词和概念定义' },
  { id: 'skill', label: '技能超边', icon: Zap, desc: '定义 Agent 可执行的具体业务技能边界' },
];

function App() {
  const [activeTab, setActiveTab] = useState('my-hypergraph');
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [activeColleague, setActiveColleague] = useState<string | null>('sales-mei');
  const [activeQaSession, setActiveQaSession] = useState<string | null>('qa-1');
  const [activeHypergraphMenu, setActiveHypergraphMenu] = useState<string>('view');
  const [activeGraphElement, setActiveGraphElement] = useState<string | null>(null);
  // const [activeWorkspaceFile, setActiveWorkspaceFile] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  
  // Graph Dragging State
  const [graphOffset, setGraphOffset] = useState({ x: -150, y: -50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // App Action Menu State
  const [activeActionMenuId, setActiveActionMenuId] = useState<number | null>(null);
  
  // Document target type
  const [docTargetType, setDocTargetType] = useState('new');
  
  // Dreaming State
  const [isDreaming, setIsDreaming] = useState(false);

  // DB Parse State
  const [isDbParsed, setIsDbParsed] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const mockDbTables = [
    { id: 't1', name: 'sales_orders', desc: '销售主订单表', relations: ['customers (customer_id)'] },
    { id: 't2', name: 'order_items', desc: '订单明细表', relations: ['sales_orders (order_id)', 'products (product_id)'] },
    { id: 't3', name: 'customers', desc: '客户信息表', relations: [] }
  ];

  const handleGraphMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging on the background, not on nodes/edges
    if ((e.target as HTMLElement).closest('.node-edge-element')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - graphOffset.x, y: e.clientY - graphOffset.y });
  };

  const handleGraphMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setGraphOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleGraphMouseUp = () => {
    setIsDragging(false);
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch(level) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium': return <Bell className="w-4 h-4 text-yellow-600" />;
      case 'info': return <Bell className="w-4 h-4 text-blue-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'excel': return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
      case 'image': return <FileImage className="w-4 h-4 text-purple-600" />;
      case 'code': return <FileCode className="w-4 h-4 text-gray-600" />;
      default: return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">
      {/* Primary Sidebar - Navigation */}
      <div className="w-16 bg-gray-100 flex flex-col items-end py-4 space-y-2 z-10 border-r border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-14 py-4 rounded-l-xl border-y border-l transition-all relative ${
                isActive
                  ? 'bg-white border-gray-200 text-blue-600 z-20 mr-[-1px]'
                  : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200 mr-1'
              }`}
            >
              <Icon className="w-5 h-5 mb-2" />
              <span 
                className="text-xs font-medium tracking-widest" 
                style={{ writingMode: 'vertical-rl' }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Sidebar - Context specific content */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm z-0 flex flex-col">
        {activeTab === 'app-info' && (
          <>
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">应用列表</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setActiveApp(app.id)}
                  className={`relative w-full flex items-center justify-center p-4 rounded-2xl border-2 transition-all group shadow-sm ${
                    activeApp === app.id 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-800 hover:border-blue-600 hover:bg-blue-50 bg-white'
                  }`}
                >
                  <span className={`text-sm font-bold ${
                    activeApp === app.id ? 'text-blue-700' : 'text-gray-800 group-hover:text-blue-700'
                  }`}>
                    {app.name}
                  </span>
                  {app.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                      {app.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {/* Assistant Button at Bottom */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => setActiveApp('assistant')}
                className={`w-full flex items-center justify-center space-x-2 p-3 rounded-xl border border-dashed transition-all ${
                  activeApp === 'assistant'
                    ? 'border-blue-500 bg-blue-100 text-blue-700 font-bold'
                    : 'border-gray-400 bg-white hover:border-blue-400 hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                }`}
              >
                <Bot className="w-5 h-5" />
                <span className="text-sm font-medium">应用创建助手</span>
              </button>
            </div>
          </>
        )}
        
        {activeTab === 'virtual-colleagues' && (
          <>
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">虚拟同事列表</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {colleagues.map((colleague) => (
                <button
                  key={colleague.id}
                  onClick={() => setActiveColleague(colleague.id)}
                  className={`w-full flex items-center p-3 rounded-2xl border-2 transition-all group shadow-sm ${
                    activeColleague === colleague.id 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${colleague.avatar}`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <div className={`text-sm font-bold ${
                      activeColleague === colleague.id ? 'text-blue-700' : 'text-gray-800'
                    }`}>
                      {colleague.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{colleague.role}</div>
                  </div>
                </button>
              ))}
            </div>
            {/* Create Virtual Colleague Button */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => setActiveColleague('create-colleague')}
                className={`w-full flex items-center justify-center space-x-2 p-3 rounded-xl border border-dashed transition-all ${
                  activeColleague === 'create-colleague'
                    ? 'border-blue-500 bg-blue-100 text-blue-700 font-bold'
                    : 'border-gray-400 bg-white hover:border-blue-400 hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                }`}
              >
                <UserPlus className="w-5 h-5" />
                <span className="text-sm font-medium">虚拟同事创建</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'my-hypergraph' && (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">我的超图</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <button 
                onClick={() => setActiveHypergraphMenu('view')}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                  activeHypergraphMenu === 'view'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Share2 className={`w-5 h-5 ${activeHypergraphMenu === 'view' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>Hypergraph</span>
              </button>

              <div className="pt-4 pb-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">数据治理</div>
              </div>

              {governanceItems.map(item => {
                const ItemIcon = item.icon;
                return (
                  <button 
                    key={item.id}
                    onClick={() => setActiveHypergraphMenu(item.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                      activeHypergraphMenu === item.id
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <ItemIcon className={`w-5 h-5 ${activeHypergraphMenu === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Hypergraph Assistant Button at Bottom */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => setActiveHypergraphMenu('assistant')}
                className={`w-full flex items-center justify-center space-x-2 p-3 rounded-xl border border-dashed transition-all ${
                  activeHypergraphMenu === 'assistant'
                    ? 'border-blue-500 bg-blue-100 text-blue-700 font-bold'
                    : 'border-gray-400 bg-white hover:border-blue-400 hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                }`}
              >
                <Bot className="w-5 h-5" />
                <span className="text-sm font-medium">超图助手</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">问答会话</h2>
            </div>
            
            <div className="p-4 pt-4">
              <button 
                onClick={() => setActiveQaSession('new')}
                className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 p-2.5 rounded-xl transition-all shadow-sm font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>新建会话 (New Session)</span>
              </button>
            </div>
            
            <div className="px-4 pb-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">历史记录</div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 space-y-1">
              {qaHistory.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveQaSession(session.id)}
                  className={`w-full flex flex-col p-3 rounded-xl transition-all group ${
                    activeQaSession === session.id 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <MessageSquare className={`w-4 h-4 ${activeQaSession === session.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span className="text-sm font-medium truncate">{session.title}</span>
                  </div>
                  <span className={`text-xs pl-6 text-left ${activeQaSession === session.id ? 'text-blue-400' : 'text-gray-400'}`}>
                    {session.time}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 p-6 overflow-auto relative">
        {activeTab === 'my-hypergraph' && activeHypergraphMenu === 'view' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full w-full flex flex-col overflow-hidden relative">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Hypergraph Visualization</h2>
                <p className="text-xs text-gray-500">点击节点或超边查看详情</p>
              </div>
              <div className="flex space-x-4 text-xs font-medium">
                <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-400"></div><span>数据节点 (表)</span></div>
                <div className="flex items-center space-x-2"><div className="w-3 h-3 rotate-45 bg-pink-100 border border-pink-400"></div><span>超边 (业务事件)</span></div>
              </div>
            </div>
            
            <div 
              className={`flex-1 relative bg-slate-50 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleGraphMouseDown}
              onMouseMove={handleGraphMouseMove}
              onMouseUp={handleGraphMouseUp}
              onMouseLeave={handleGraphMouseUp}
            >
              <div 
                className="absolute inset-0 origin-top-left transition-none"
                style={{ transform: `translate(${graphOffset.x}px, ${graphOffset.y}px)` }}
              >
                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: 2000, minHeight: 2000 }}>
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#9CA3AF" />
                    </marker>
                    <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
                    </marker>
                    <marker id="arrowhead-edge" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#EC4899" />
                    </marker>
                    <marker id="arrowhead-doc" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#10B981" />
                    </marker>
                  </defs>
                  
                  {/* Nodes to Edges (Original) */}
                  <line x1="250" y1="400" x2="300" y2="200" stroke={activeGraphElement === 'node-1' || activeGraphElement === 'edge-1' ? '#3B82F6' : '#D1D5DB'} strokeWidth="2" strokeDasharray="5,5" markerEnd={`url(#${activeGraphElement === 'node-1' || activeGraphElement === 'edge-1' ? 'arrowhead-active' : 'arrowhead'})`} />
                  <line x1="450" y1="350" x2="300" y2="200" stroke={activeGraphElement === 'node-2' || activeGraphElement === 'edge-1' ? '#3B82F6' : '#D1D5DB'} strokeWidth="2" strokeDasharray="5,5" markerEnd={`url(#${activeGraphElement === 'node-2' || activeGraphElement === 'edge-1' ? 'arrowhead-active' : 'arrowhead'})`} />
                  
                  <line x1="250" y1="400" x2="500" y2="250" stroke={activeGraphElement === 'node-1' || activeGraphElement === 'edge-2' ? '#3B82F6' : '#D1D5DB'} strokeWidth="2" strokeDasharray="5,5" markerEnd={`url(#${activeGraphElement === 'node-1' || activeGraphElement === 'edge-2' ? 'arrowhead-active' : 'arrowhead'})`} />
                  <line x1="650" y1="450" x2="500" y2="250" stroke={activeGraphElement === 'node-3' || activeGraphElement === 'edge-2' ? '#3B82F6' : '#D1D5DB'} strokeWidth="2" strokeDasharray="5,5" markerEnd={`url(#${activeGraphElement === 'node-3' || activeGraphElement === 'edge-2' ? 'arrowhead-active' : 'arrowhead'})`} />
                  
                  <line x1="450" y1="350" x2="700" y2="180" stroke={activeGraphElement === 'node-2' || activeGraphElement === 'edge-3' ? '#3B82F6' : '#D1D5DB'} strokeWidth="2" strokeDasharray="5,5" markerEnd={`url(#${activeGraphElement === 'node-2' || activeGraphElement === 'edge-3' ? 'arrowhead-active' : 'arrowhead'})`} />
                  <line x1="650" y1="450" x2="700" y2="180" stroke={activeGraphElement === 'node-3' || activeGraphElement === 'edge-3' ? '#3B82F6' : '#D1D5DB'} strokeWidth="2" strokeDasharray="5,5" markerEnd={`url(#${activeGraphElement === 'node-3' || activeGraphElement === 'edge-3' ? 'arrowhead-active' : 'arrowhead'})`} />

                  {/* Node to Node Connections (Foreign Keys) */}
                  <path d="M 250 400 Q 350 430 450 350" fill="none" stroke={activeGraphElement === 'node-1' || activeGraphElement === 'node-2' ? '#3B82F6' : '#9CA3AF'} strokeWidth="1.5" markerEnd={`url(#${activeGraphElement === 'node-1' || activeGraphElement === 'node-2' ? 'arrowhead-active' : 'arrowhead'})`} />
                  <path d="M 450 350 Q 550 440 650 450" fill="none" stroke={activeGraphElement === 'node-2' || activeGraphElement === 'node-3' ? '#3B82F6' : '#9CA3AF'} strokeWidth="1.5" markerEnd={`url(#${activeGraphElement === 'node-2' || activeGraphElement === 'node-3' ? 'arrowhead-active' : 'arrowhead'})`} />
                  
                  {/* Document Node Connections */}
                  <line x1="170" y1="280" x2="300" y2="200" stroke={activeGraphElement === 'doc-1' || activeGraphElement === 'edge-1' ? '#10B981' : '#D1D5DB'} strokeWidth="2" strokeDasharray="3,3" markerEnd="url(#arrowhead-doc)" />
                  <line x1="170" y1="280" x2="250" y2="400" stroke={activeGraphElement === 'doc-1' || activeGraphElement === 'node-1' ? '#10B981' : '#D1D5DB'} strokeWidth="2" strokeDasharray="3,3" markerEnd="url(#arrowhead-doc)" />
                  
                  <line x1="870" y1="300" x2="700" y2="180" stroke={activeGraphElement === 'doc-2' || activeGraphElement === 'edge-3' ? '#10B981' : '#D1D5DB'} strokeWidth="2" strokeDasharray="3,3" markerEnd="url(#arrowhead-doc)" />

                  {/* Edge to Edge Connections (Process Flow) */}
                  <path d="M 300 200 Q 400 100 500 250" fill="none" stroke={activeGraphElement === 'edge-1' || activeGraphElement === 'edge-2' ? '#EC4899' : '#FCA5A5'} strokeWidth="2" strokeDasharray="8,4" markerEnd="url(#arrowhead-edge)" />
                  <path d="M 500 250 Q 600 150 700 180" fill="none" stroke={activeGraphElement === 'edge-2' || activeGraphElement === 'edge-3' ? '#EC4899' : '#FCA5A5'} strokeWidth="2" strokeDasharray="8,4" markerEnd="url(#arrowhead-edge)" />
                </svg>

              {/* Hyperedges (Pink Diamonds) */}
              <div 
                onClick={() => setActiveGraphElement('edge-1')}
                className={`node-edge-element absolute left-[280px] top-[180px] w-12 h-12 rotate-45 flex items-center justify-center cursor-pointer transition-all shadow-md ${
                  activeGraphElement === 'edge-1' ? 'bg-pink-300 border-2 border-pink-600 scale-110 z-20' : 'bg-pink-100 border border-pink-400 hover:bg-pink-200 z-10'
                }`}
              >
                <div className="-rotate-45 text-xs font-bold text-pink-800">采购</div>
              </div>
              
              <div 
                onClick={() => setActiveGraphElement('edge-2')}
                className={`node-edge-element absolute left-[480px] top-[230px] w-12 h-12 rotate-45 flex items-center justify-center cursor-pointer transition-all shadow-md ${
                  activeGraphElement === 'edge-2' ? 'bg-pink-300 border-2 border-pink-600 scale-110 z-20' : 'bg-pink-100 border border-pink-400 hover:bg-pink-200 z-10'
                }`}
              >
                <div className="-rotate-45 text-xs font-bold text-pink-800">发货</div>
              </div>

              <div 
                onClick={() => setActiveGraphElement('edge-3')}
                className={`node-edge-element absolute left-[680px] top-[160px] w-12 h-12 rotate-45 flex items-center justify-center cursor-pointer transition-all shadow-md ${
                  activeGraphElement === 'edge-3' ? 'bg-pink-300 border-2 border-pink-600 scale-110 z-20' : 'bg-pink-100 border border-pink-400 hover:bg-pink-200 z-10'
                }`}
              >
                <div className="-rotate-45 text-xs font-bold text-pink-800">合同</div>
              </div>

              {/* Document Nodes (Green Squares) */}
              <div 
                onClick={() => setActiveGraphElement('doc-1')}
                className={`node-edge-element absolute left-[150px] top-[260px] w-14 h-14 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all shadow-md ${
                  activeGraphElement === 'doc-1' ? 'bg-green-300 border-2 border-green-600 scale-110 z-20' : 'bg-green-50 border border-green-400 hover:bg-green-100 z-10'
                }`}
              >
                <FileText className={`w-5 h-5 ${activeGraphElement === 'doc-1' ? 'text-green-800' : 'text-green-600'}`} />
                <span className="text-[9px] font-bold text-green-900 mt-1">采购规范</span>
              </div>
              
              <div 
                onClick={() => setActiveGraphElement('doc-2')}
                className={`node-edge-element absolute left-[850px] top-[280px] w-14 h-14 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all shadow-md ${
                  activeGraphElement === 'doc-2' ? 'bg-green-300 border-2 border-green-600 scale-110 z-20' : 'bg-green-50 border border-green-400 hover:bg-green-100 z-10'
                }`}
              >
                <FileText className={`w-5 h-5 ${activeGraphElement === 'doc-2' ? 'text-green-800' : 'text-green-600'}`} />
                <span className="text-[9px] font-bold text-green-900 mt-1">合同法</span>
              </div>

              {/* Nodes (Blue Circles) */}
              <div 
                onClick={() => setActiveGraphElement('node-1')}
                className={`node-edge-element absolute left-[220px] top-[370px] w-16 h-16 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all shadow-md ${
                  activeGraphElement === 'node-1' ? 'bg-blue-300 border-2 border-blue-600 scale-110 z-20' : 'bg-blue-100 border border-blue-400 hover:bg-blue-200 z-10'
                }`}
              >
                <Database className={`w-5 h-5 ${activeGraphElement === 'node-1' ? 'text-blue-800' : 'text-blue-600'}`} />
                <span className="text-[10px] font-bold text-blue-900 mt-0.5">Order</span>
              </div>

              <div 
                onClick={() => setActiveGraphElement('node-2')}
                className={`node-edge-element absolute left-[420px] top-[320px] w-16 h-16 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all shadow-md ${
                  activeGraphElement === 'node-2' ? 'bg-blue-300 border-2 border-blue-600 scale-110 z-20' : 'bg-blue-100 border border-blue-400 hover:bg-blue-200 z-10'
                }`}
              >
                <Database className={`w-5 h-5 ${activeGraphElement === 'node-2' ? 'text-blue-800' : 'text-blue-600'}`} />
                <span className="text-[10px] font-bold text-blue-900 mt-0.5">Contract</span>
              </div>

              <div 
                  onClick={() => setActiveGraphElement('node-3')}
                  className={`node-edge-element absolute left-[620px] top-[420px] w-16 h-16 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all shadow-md ${
                    activeGraphElement === 'node-3' ? 'bg-blue-300 border-2 border-blue-600 scale-110 z-20' : 'bg-blue-100 border border-blue-400 hover:bg-blue-200 z-10'
                  }`}
                >
                  <Database className={`w-5 h-5 ${activeGraphElement === 'node-3' ? 'text-blue-800' : 'text-blue-600'}`} />
                  <span className="text-[10px] font-bold text-blue-900 mt-0.5">Shipping</span>
                </div>
              </div>

              {/* Element Details Sidebar Overlay */}
              {activeGraphElement && (
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur shadow-2xl border-l border-gray-200 p-6 flex flex-col animate-in slide-in-from-right-8 z-50">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">
                      {activeGraphElement.startsWith('node') ? '节点详情' : '超边详情'}
                    </h3>
                    <button onClick={() => setActiveGraphElement(null)} className="p-1 hover:bg-gray-100 rounded-md">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  {activeGraphElement.startsWith('node') ? (
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">表名称</div>
                        <div className="font-mono text-sm bg-gray-100 p-2 rounded border border-gray-200">
                          {activeGraphElement === 'node-1' ? 'sales_order' : activeGraphElement === 'node-2' ? 'sales_contracts' : 'shipping_applications'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">数据源</div>
                        <div className="text-sm font-medium">SAP ERP System (Production)</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">包含字段</div>
                        <div className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-100 space-y-1">
                          <div className="flex justify-between"><span className="font-mono text-blue-800">id</span><span className="text-blue-600">VARCHAR(32)</span></div>
                          <div className="flex justify-between"><span className="font-mono text-blue-800">status</span><span className="text-blue-600">INT</span></div>
                          <div className="flex justify-between"><span className="font-mono text-blue-800">created_at</span><span className="text-blue-600">TIMESTAMP</span></div>
                        </div>
                      </div>
                    </div>
                  ) : previewFile === 'file-4' ? (
                    <div className="w-full h-full bg-white p-0 rounded-xl shadow-sm border border-gray-100 overflow-auto">
                      <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 rounded-tl-lg border-b border-gray-200">订单编号</th>
                            <th className="px-4 py-3 border-b border-gray-200">物料编码</th>
                            <th className="px-4 py-3 border-b border-gray-200">物料名称</th>
                            <th className="px-4 py-3 border-b border-gray-200">订单数量</th>
                            <th className="px-4 py-3 border-b border-gray-200">已发货数量</th>
                            <th className="px-4 py-3 rounded-tr-lg border-b border-gray-200">状态</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-gray-900">SOPB_20190321_006</td>
                            <td className="px-4 py-3 font-mono">204018002</td>
                            <td className="px-4 py-3">继电器输入端子板(8路24VDC_有源_冗余型)</td>
                            <td className="px-4 py-3 text-center">3</td>
                            <td className="px-4 py-3 text-center text-red-600 font-bold">0</td>
                            <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-semibold">Unshipped</span></td>
                          </tr>
                          <tr className="border-b border-gray-100 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-gray-900">SOPB_20190321_006</td>
                            <td className="px-4 py-3 font-mono">204030205</td>
                            <td className="px-4 py-3">通用继电器输出端子板(16路_有源)</td>
                            <td className="px-4 py-3 text-center">3</td>
                            <td className="px-4 py-3 text-center text-red-600 font-bold">0</td>
                            <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-semibold">Unshipped</span></td>
                          </tr>
                          <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-gray-900">SOPB_20190321_006</td>
                            <td className="px-4 py-3 font-mono">201010056</td>
                            <td className="px-4 py-3">主控板(CPU_MODULE)</td>
                            <td className="px-4 py-3 text-center">1</td>
                            <td className="px-4 py-3 text-center text-green-600 font-bold">1</td>
                            <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">Shipped</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">业务事件</div>
                        <div className="font-bold text-lg text-pink-700">
                          {activeGraphElement === 'edge-1' ? '采购订单创建' : activeGraphElement === 'edge-2' ? '发货申请审批' : '销售合同签订'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">事件简介</div>
                        <div className="text-sm text-gray-700">
                          当发生此业务行为时，系统将串联相关的数据表产生状态变更流转。
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-2">关联节点</div>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-mono border border-blue-200">sales_order</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-mono border border-blue-200">sales_contracts</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 mt-4 border-t border-gray-100">
                        <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2 border border-blue-200">
                          <Settings className="w-4 h-4" />
                          <span>修改超边配置</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Dreaming Button at bottom center */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <button 
                  onClick={() => setIsDreaming(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1 font-semibold group"
                >
                  <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                  <span>Dreaming...</span>
                </button>
              </div>

              {/* Dreaming Modal */}
              {isDreaming && (
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-3 text-purple-600">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                        <h3 className="text-xl font-bold text-gray-900">图模型训练 (Dreaming)</h3>
                      </div>
                      <button 
                        onClick={() => setIsDreaming(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center py-6 bg-purple-50 rounded-xl border border-purple-100">
                        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                        <p className="text-sm font-medium text-purple-900">正在分析全局超边拓扑网络...</p>
                        <p className="text-xs text-purple-600/70 mt-2">预计需要 3-5 分钟</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700">提取数据节点元信息 (124/124)</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700">解析业务事件逻辑规则 (18/18)</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm">
                          <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                          <span className="text-gray-800 font-medium">更新超图神经网络嵌入向量...</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm opacity-50">
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                          <span className="text-gray-500">生成隐式业务关联推荐</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <button 
                        onClick={() => setIsDreaming(false)}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        后台运行
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'my-hypergraph' && governanceItems.find(item => item.id === activeHypergraphMenu) ? (
          (() => {
            const currentItem = governanceItems.find(item => item.id === activeHypergraphMenu)!;
            const Icon = currentItem.icon;
            return (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full w-full flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-white">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">添加{currentItem.label}</h2>
                    <p className="text-sm text-gray-500">{currentItem.desc}</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                  <div className="max-w-2xl mx-auto space-y-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    {activeHypergraphMenu === 'db' ? (
                      // Database Config Form
                      isDbParsed ? (
                        <>
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                              数据库解析完成
                            </h3>
                            <button 
                              onClick={() => setIsDbParsed(false)}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              重新解析
                            </button>
                          </div>
                          
                          <div className="space-y-6">
                            {mockDbTables.map(table => (
                              <div key={table.id} className={`p-5 rounded-xl border ${selectedTables.includes(table.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} transition-colors`}>
                                <div className="flex items-start space-x-3">
                                  <input 
                                    type="checkbox" 
                                    className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                    checked={selectedTables.includes(table.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedTables([...selectedTables, table.id]);
                                      } else {
                                        setSelectedTables(selectedTables.filter(id => id !== table.id));
                                      }
                                    }}
                                  />
                                  <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="font-mono font-bold text-gray-800">{table.name}</span>
                                    </div>
                                    
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">补充说明信息</label>
                                      <input 
                                        type="text" 
                                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                                        defaultValue={table.desc}
                                        placeholder="输入该表的业务含义..."
                                      />
                                    </div>
                                    
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1 flex items-center justify-between">
                                        <span>自动发现与手动关联关系</span>
                                        <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                                          <Plus className="w-3 h-3" />
                                          <span>添加关联</span>
                                        </button>
                                      </label>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        {table.relations.length > 0 ? (
                                          table.relations.map((rel, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-gray-100 border border-gray-200 text-gray-700 text-xs rounded-md font-mono flex items-center">
                                              <Link className="w-3 h-3 mr-1 text-gray-400" />
                                              {rel}
                                            </span>
                                          ))
                                        ) : (
                                          <span className="text-xs text-gray-400 italic">暂无关联关系</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">1</span>
                              数据库配置
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">数据库类型</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                                  <option>MySQL</option>
                                  <option>PostgreSQL</option>
                                  <option>Oracle</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">连接地址</label>
                                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="jdbc:mysql://..." />
                              </div>
                            </div>
                          </div>
                          <hr className="border-gray-100" />
                          <div>
                            <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">2</span>
                              表结构定义上传
                            </h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-blue-400 transition-all cursor-pointer">
                              <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                              <p className="text-sm text-gray-600 font-medium">点击或拖拽上传 DDL 文件</p>
                              <p className="text-xs text-gray-400 mt-1">支持 .sql, .txt 格式，系统将自动解析字段</p>
                            </div>
                          </div>
                        </>
                      )
                    ) : activeHypergraphMenu === 'doc' ? (
                      // Document Upload Form
                      <>
                        <div>
                          <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">1</span>
                            业务文档上传
                          </h3>
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer">
                            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600 font-medium">点击或拖拽上传非结构化文档，支持多选批量上传</p>
                            <p className="text-xs text-gray-400 mt-1">支持 .pdf, .docx, .md 等格式。系统将合并解析所有文档提取实体与超边关系</p>
                          </div>
                          
                          {/* 模拟已上传的批量文件列表 */}
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-gray-700">2023年度大客户销售流程规范.pdf</span>
                              </div>
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span>2.4 MB</span>
                                <button className="hover:text-red-500"><X className="w-4 h-4" /></button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-gray-700">华东区退换货规则说明.docx</span>
                              </div>
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span>856 KB</span>
                                <button className="hover:text-red-500"><X className="w-4 h-4" /></button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <hr className="border-gray-100" />

                        <div>
                          <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">2</span>
                            解析目标设置
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-6">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="doc_target" 
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                                  checked={docTargetType === 'new'}
                                  onChange={() => setDocTargetType('new')}
                                />
                                <span className="text-sm font-medium text-gray-700">创建新超边</span>
                              </label>
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="doc_target" 
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                                  checked={docTargetType === 'existing'}
                                  onChange={() => setDocTargetType('existing')}
                                />
                                <span className="text-sm font-medium text-gray-700">添加到已有超边</span>
                              </label>
                            </div>
                            
                            {docTargetType === 'new' ? (
                              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">新超边名称 (可选)</label>
                                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white" placeholder="若不填将根据文档内容自动生成" />
                              </div>
                            ) : (
                              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">选择目标超边</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                                  <option value="">请选择要关联的超边...</option>
                                  <option value="edge1">采购订单创建</option>
                                  <option value="edge2">发货申请审批</option>
                                  <option value="edge3">销售合同签订</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-2">文档解析出的逻辑和实体将作为知识和规则补充到该超边中</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      // Generic Form for others (table, api, rule, term, skill)
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{currentItem.label}名称</label>
                          <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder={`输入${currentItem.label}的名称`} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">简要描述</label>
                          <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-20" placeholder={`描述该${currentItem.label}的具体作用...`}></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">附件或数据源 (可选)</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 hover:border-blue-400 transition-all cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">点击上传关联文件</p>
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="pt-4 flex justify-end space-x-3">
                      {activeHypergraphMenu === 'db' && isDbParsed ? (
                        <>
                          <button 
                            disabled={selectedTables.length < 2}
                            className={`px-6 py-2 font-medium rounded-lg transition-colors shadow-sm ${selectedTables.length < 2 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-pink-600 text-white hover:bg-pink-700'}`}
                          >
                            为选中表合并创建超边
                          </button>
                          <button 
                            disabled={selectedTables.length === 0}
                            className={`px-6 py-2 font-medium rounded-lg transition-colors shadow-sm ${selectedTables.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                          >
                            为各表分别创建超边
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => {
                            if (activeHypergraphMenu === 'db') {
                              setIsDbParsed(true);
                            }
                          }}
                          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          {activeHypergraphMenu === 'db' ? '解析数据库' : '确认添加并解析'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : activeTab === 'my-hypergraph' && activeHypergraphMenu === 'assistant' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full w-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">超图助手</h2>
                <p className="text-xs text-gray-500">通过对话为您创建、更改或优化超图结构</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                  <p className="text-sm">你好！我是超图助手。你可以直接告诉我你的业务需求，比如：</p>
                  <ul className="text-sm list-disc pl-4 space-y-1 text-gray-600 mt-2">
                    <li>“帮我把刚才上传的采购管理规范文档解析成业务规则节点”</li>
                    <li>“检查一下目前销售相关的超边有没有遗漏什么节点”</li>
                    <li>“我要修改一下‘发货申请’这个技能超边，增加一个审批节点”</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <input 
                  type="text" 
                  className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-gray-800 placeholder-gray-400"
                  placeholder="告诉助手你需要怎么调整超图..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'qa' && activeQaSession ? (
          <div className="h-full w-full flex space-x-6">
            {/* Left: Chat Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center space-x-2 text-gray-800 font-semibold">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span>
                    {activeQaSession === 'new' 
                      ? 'New Session' 
                      : qaHistory.find(s => s.id === activeQaSession)?.title}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeQaSession === 'new' ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <Bot className="w-12 h-12 text-gray-300" />
                    <p>这是一个新的问答会话，请在下方输入你的问题</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-end">
                      <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                        <p className="text-sm">合同SCJSD20190321-FZ01为什么没有确认收货</p>
                      </div>
                    </div>
                    <div className="flex justify-start items-end space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm space-y-3">
                        <p className="text-sm font-bold">结论（先说重点）</p>
                        <p className="text-sm text-gray-700">合同 SCJSD20190321-FZ01 未能确认收货的根因是：该合同下所有物料均未提交发货申请（drafted_delivery_qty=0），因此未进入发货、运输与现场签收环节，自然无法确认收货；合同整体履约状态为未完成。</p>
                        
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-sm font-semibold text-gray-800 mb-2">证据数据（阻塞物料与原因）</p>
                          <ul className="text-sm list-disc pl-4 space-y-2 text-gray-600">
                            <li>
                              <span className="font-medium text-gray-800">继电器输入端子板(8路24VDC_有源_冗余型)</span>
                              <br/>物料编码：204018002 | 缺失发货申请数量：3
                              <br/><span className="text-red-600">阻塞原因：未申请发货（Unshipped）</span>
                            </li>
                            <li>
                              <span className="font-medium text-gray-800">通用继电器输出端子板(16路_有源)</span>
                              <br/>物料编码：204030205 | 缺失发货申请数量：3
                              <br/><span className="text-red-600">阻塞原因：未申请发货（Unshipped）</span>
                            </li>
                          </ul>
                        </div>
                        
                        <p className="text-sm font-bold mt-3">建议的下一步处理</p>
                        <ul className="text-sm list-decimal pl-4 space-y-1 text-gray-700">
                          <li>请尽快在系统中为上述两项物料分别提交发货申请。</li>
                          <li>提交后关注对应后续环节（直发跟进供应商发货，仓库出库关注WMS出库）。</li>
                        </ul>
                        <p className="text-sm text-gray-500 italic mt-2">（详细分析报告已生成在右侧工作区：human_readable.json）</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-start items-end space-x-2 mt-4 ml-10">
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center space-x-4 shadow-sm relative">
                        <span className="text-sm font-medium text-blue-800">该异常阻塞需要处理吗？</span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setActiveActionMenuId(1001)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
                          >
                            <span>立即处理</span>
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <button className="px-3 py-1.5 bg-white text-gray-600 border border-gray-200 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors">
                            忽略
                          </button>
                        </div>
                        
                        {activeActionMenuId === 1001 && (
                          <div className="absolute top-full left-1/2 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10 animate-in fade-in slide-in-from-top-1">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">指派虚拟同事</div>
                            <button 
                              onClick={() => { setActiveColleague('sales-mei'); setActiveTab('virtual-colleagues'); setActiveActionMenuId(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
                            >
                              <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-600"><Users className="w-3 h-3" /></div>
                              <span>销售小美</span>
                            </button>
                            <button 
                              onClick={() => { setActiveColleague('purchase-jie'); setActiveTab('virtual-colleagues'); setActiveActionMenuId(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
                            >
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Users className="w-3 h-3" /></div>
                              <span>采购阿杰</span>
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button 
                              onClick={() => setActiveActionMenuId(null)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><Hand className="w-3 h-3" /></div>
                              <span>手动处理</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                  <Search className="w-5 h-5 text-gray-400 ml-2" />
                  <input 
                    type="text" 
                    className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-gray-800 placeholder-gray-400"
                    placeholder="New query..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                  />
                  <button className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Workspace & Preview Area */}
            <div className="w-80 flex flex-col space-y-6">
              {/* Workspace Files */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col flex-shrink-0 max-h-[40%]">
                <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                  <h3 className="font-semibold text-gray-800 text-sm">Workspace Files</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {qaWorkspaceFiles.map(file => (
                    <button 
                      key={file.id}
                      onClick={() => setPreviewFile(file.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all border-gray-100 hover:border-blue-300 hover:bg-blue-50`}
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        {getFileIcon(file.type)}
                        <span className="text-sm truncate text-gray-700 font-medium">
                          {file.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Agent Trace Show */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden relative group">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">
                    Agent Trace
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                  {agentTraces.map((trace, index) => (
                    <div key={trace.id} className="relative">
                      {/* 连接线 */}
                      {index !== agentTraces.length - 1 && (
                        <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-gray-200"></div>
                      )}
                      
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 border-white shadow-sm ${
                          trace.type === 'assistant' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {trace.type === 'assistant' ? <Bot className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span className={`text-xs font-bold uppercase tracking-wider ${
                              trace.type === 'assistant' ? 'text-purple-700' : 'text-orange-700'
                            }`}>
                              {trace.title}
                            </span>
                            {trace.status === 'success' && (
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                            )}
                          </div>
                          <div className="text-xs text-gray-600 leading-relaxed font-mono bg-gray-50 p-2 rounded border border-gray-100 break-words">
                            {trace.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* File Preview Overlay */}
            {previewFile && (
              <div className="absolute inset-6 bg-white/95 backdrop-blur-sm z-50 flex flex-col rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(qaWorkspaceFiles.find(f => f.id === previewFile)?.type || '')}
                    <span className="font-semibold text-gray-800">
                      {qaWorkspaceFiles.find(f => f.id === previewFile)?.name}
                    </span>
                  </div>
                  <button 
                    onClick={() => setPreviewFile(null)}
                    className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 p-6 overflow-auto bg-gray-50 flex items-center justify-center">
                  {previewFile === 'file-1' ? (
                    <div className="w-full h-full bg-gray-900 text-green-400 p-6 font-mono text-sm overflow-auto rounded-xl shadow-sm">
                      <pre>
                        <code>
{`{
  "session_id": "eval_1624c536b8",
  "request_id": "efb63324-d072-4ae5-8bfe-76970e4fa2a6",
  "id": "SCJSD20190321-FZ01",
  "query": "合同SCJSD20190321-FZ01为什么没有确认收货",
  "nodes": [
    "financial_sales_outbound",
    "purchase_delivery_details",
    "purchase_order_details",
    "sales_contracts",
    "sales_order",
    "sap_shipping_applications",
    "shipping_applications",
    "site_receipt_details",
    "supplier_delivery_notes",
    "wms_outbound_records"
  ],
  "hyperedges": [],
  "final_anwser": "合同 SCJSD20190321-FZ01 未能确认收货的根因是：该合同下所有物料均未提交发货申请（drafted_delivery_qty=0），因此未进入发货、运输与现场签收环节，自然无法确认收货；合同整体履约状态为未完成。\\n\\n证据数据（阻塞物料与原因）\\n- 物料：继电器输入端子板(8路24VDC_有源_冗余型)\\n  - 物料编码：204018002\\n  - 所属销售订单：SOPB_20190321_006\\n  - 订单数量：3\\n  - 已提交发货申请数量：0\\n  - 缺失发货申请数量：3\\n  - 阻塞原因：未申请发货（Unshipped）\\n  - 属性说明：因未提交发货申请，直发/仓库属性尚未进入判定流程\\n\\n..."
}`}
                        </code>
                      </pre>
                    </div>
                  ) : previewFile === 'file-2' ? (
                    <div className="w-full h-full bg-gray-900 text-green-400 p-6 font-mono text-sm overflow-auto rounded-xl shadow-sm">
                      <pre>
                        <code>
{`import json
import sys

def analyze_blocking_nodes(contract_id):
    print(f"Starting reverse analysis for {contract_id}...")
    # Analyzing missing shipping applications...
    # Found 2 items with drafted_delivery_qty = 0
    return {
        "status": "blocked_at_shipping",
        "items": ["204018002", "204030205"]
    }

if __name__ == "__main__":
    analyze_blocking_nodes(sys.argv[1])`}
                        </code>
                      </pre>
                    </div>
                  ) : previewFile === 'file-3' ? (
                    <div className="w-full h-full bg-gray-900 text-green-400 p-6 font-mono text-sm overflow-auto rounded-xl shadow-sm">
                      <pre>
                        <code>
{`{
  "sales_contracts": [
    {
      "contract_code": "SCJSD20190321-FZ01",
      "status": "processing",
      "total_amount": 150000.00
    }
  ],
  "sales_order": [
    {
      "order_code": "SOPB_20190321_006",
      "contract_code": "SCJSD20190321-FZ01",
      "items": [
        {
          "item_code": "204018002",
          "qty": 3
        },
        {
          "item_code": "204030205",
          "qty": 3
        }
      ]
    }
  ],
  "shipping_applications": []
}`}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <p className="text-lg font-medium">文件预览</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'app-info' && activeApp === 'assistant' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full w-full flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">应用创建助手</h2>
                <p className="text-xs text-gray-500">创建一个定时的或事件触发的监控应用</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                  <p className="text-sm">你好！我是应用创建助手。你想创建一个什么类型的监控应用？</p>
                  <p className="text-sm mt-2 text-gray-600">例如：你可以说“我想每天早上9点检查库存是否低于预警值”，或者“当有新订单履约超时时通知我”。</p>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <input 
                  type="text" 
                  className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-gray-800 placeholder-gray-400"
                  placeholder="输入你的应用需求..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'app-info' && activeApp && mockMessages[activeApp] ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full w-full flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {apps.find(a => a.id === activeApp)?.name} - 消息通知
                </h2>
                <p className="text-sm text-gray-500 mt-1">查看来自此应用的所有监控告警和通知</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-sm px-3 py-1.5 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                  全部标记为已读
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              <div className="max-w-4xl mx-auto space-y-4">
                {mockMessages[activeApp].map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all relative ${
                      !msg.read ? 'border-blue-200 ring-1 ring-blue-50' : 'border-gray-200'
                    }`}
                  >
                    {!msg.read && (
                      <div className="absolute top-5 left-3 w-2 h-2 rounded-full bg-blue-500"></div>
                    )}
                    <div className="flex justify-between items-start ml-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg border ${getLevelColor(msg.level)}`}>
                          {getLevelIcon(msg.level)}
                        </div>
                        <div>
                          <h3 className={`font-semibold ${!msg.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {msg.title}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                            <Clock className="w-3 h-3" />
                            <span>{msg.time}</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                        查看详情
                      </button>
                    </div>
                    <div className="mt-4 ml-14 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {msg.content}
                      </div>
                      <div className="mt-3 flex items-center space-x-2 relative">
                        <button 
                          onClick={() => setActiveActionMenuId(activeActionMenuId === msg.id ? null : msg.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 transition-colors"
                        >
                          <span>立即处理</span>
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        
                        {activeActionMenuId === msg.id && (
                          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 animate-in fade-in slide-in-from-top-1">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">指派虚拟同事</div>
                            <button 
                              onClick={() => { setActiveColleague('sales-mei'); setActiveTab('virtual-colleagues'); setActiveActionMenuId(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
                            >
                              <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-600"><Users className="w-3 h-3" /></div>
                              <span>销售小美</span>
                            </button>
                            <button 
                              onClick={() => { setActiveColleague('purchase-jie'); setActiveTab('virtual-colleagues'); setActiveActionMenuId(null); }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
                            >
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Users className="w-3 h-3" /></div>
                              <span>采购阿杰</span>
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button 
                              onClick={() => setActiveActionMenuId(null)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><Hand className="w-3 h-3" /></div>
                              <span>手动处理</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
               </div>
             </div>
           </div>
         ) : activeTab === 'virtual-colleagues' && activeColleague === 'sales-mei' ? (
           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full w-full flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50">
               <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                 <Users className="w-6 h-6" />
               </div>
               <div>
                 <h2 className="text-lg font-bold text-gray-800">销售小美</h2>
                 <p className="text-xs text-gray-500">销售专员</p>
               </div>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {/* 历史记忆轮次 */}
                <div className="flex justify-center">
                  <span className="text-xs text-gray-400 bg-gray-200/50 px-3 py-1 rounded-full">上周三 14:30</span>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                    <p className="text-sm">小美，上周我们跟华东区那个大客户沟通得怎么样了？他们对我们的定制方案感兴趣吗？</p>
                  </div>
                </div>
                <div className="flex justify-start items-end space-x-2">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex-shrink-0 flex items-center justify-center text-pink-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                    <p className="text-sm">老板，已经和他们完成了初步接洽。客户对我们的产品非常感兴趣，特别是针对他们定制的物流解决方案。我当时已经将他们的核心诉求（高优发货、专属客服）记录在CRM系统里了，并把商机阶段推进到了“意向沟通”。</p>
                  </div>
                </div>

                {/* 当前轮次 */}
                <div className="flex justify-center pt-4">
                  <span className="text-xs text-gray-400 bg-gray-200/50 px-3 py-1 rounded-full">今天 10:15</span>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                    <p className="text-sm">小美，帮我看一下华东区最新的商机信息，并准备一份合同草案。</p>
                  </div>
                </div>
                <div className="flex justify-start items-end space-x-2">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex-shrink-0 flex items-center justify-center text-pink-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                    <p className="text-sm">好的，基于我们<span className="font-semibold text-pink-600">上周三在CRM中记录的客户核心诉求</span>，这是我为您整理的最新商机并自动填写的合同草案：</p>
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-sm">华东区-大客户采购合同草案.docx</span>
                      </div>
                      <p className="text-xs text-gray-500">商机编号：OPP-20231102<br/>特殊条款：包含高优发货与专属客服条款<br/>预计金额：￥500,000</p>
                    </div>
                    <p className="text-sm mt-3">合同已确认生效。是否需要我立即为您向物流部门发起发货申请？</p>
                    <div className="mt-3 flex space-x-2">
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors border border-blue-200">
                        是的，立即发起
                      </button>
                      <button className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors border border-gray-200">
                        稍后处理
                      </button>
                    </div>
                  </div>
                </div>
              </div>
             <div className="p-4 bg-white border-t border-gray-100">
               <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                 <input 
                   type="text" 
                   className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-gray-800 placeholder-gray-400"
                   placeholder="回复小美..."
                   value={chatMessage}
                   onChange={(e) => setChatMessage(e.target.value)}
                 />
                 <button className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm">
                   <Send className="w-4 h-4" />
                 </button>
               </div>
             </div>
           </div>
         ) : activeTab === 'virtual-colleagues' && activeColleague === 'purchasing-jie' ? (
           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full w-full flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-100 flex items-center space-x-3 bg-gray-50">
               <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                 <Users className="w-6 h-6" />
               </div>
               <div>
                 <h2 className="text-lg font-bold text-gray-800">采购阿杰</h2>
                 <p className="text-xs text-gray-500">采购专员</p>
               </div>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {/* 历史记忆轮次 */}
                <div className="flex justify-center">
                  <span className="text-xs text-gray-400 bg-gray-200/50 px-3 py-1 rounded-full">上周五 16:00</span>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                    <p className="text-sm">阿杰，最近商品A的消耗速度是不是变快了？我看这周的销量有些异常。</p>
                  </div>
                </div>
                <div className="flex justify-start items-end space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                    <p className="text-sm">是的，老板。我做周度复盘时也注意到了。由于近期的区域促销活动，商品A的日均消耗量比平时增加了30%。我已经提前联系了华南的供应商预定产能，并下达了补充订单（PO-20231101），预计下周就能到货以防断货。</p>
                  </div>
                </div>

                {/* 当前轮次 */}
                <div className="flex justify-center pt-4">
                  <span className="text-xs text-gray-400 bg-gray-200/50 px-3 py-1 rounded-full">今天 11:30</span>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                    <p className="text-sm">阿杰，刚才库存预警应用弹出了告警，显示商品A库存低于安全阈值（当前15件，阈值50件），系统建议自动触发采购申请。是否需要立即采购？</p>
                  </div>
                </div>
                <div className="flex justify-start items-end space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-200 text-gray-800 p-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                    <p className="text-sm">老板，不用重复采购。<span className="font-semibold text-blue-600">正如我上周五跟您汇报的</span>，我已经提前安排了预案。目前系统已经拦截了这次重复的自动采购申请：</p>
                    <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-100 flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-green-800">
                        目前有一批在途订单（订单号：PO-20231101），共计100件商品A，物流显示<span className="font-bold">预计今天下午14:00到货</span>。到货后库存将恢复至115件，完全满足日常消耗，无需恐慌采购。
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             <div className="p-4 bg-white border-t border-gray-100">
               <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                 <input 
                   type="text" 
                   className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-gray-800 placeholder-gray-400"
                   placeholder="回复阿杰..."
                   value={chatMessage}
                   onChange={(e) => setChatMessage(e.target.value)}
                 />
                 <button className="w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm">
                   <Send className="w-4 h-4" />
                 </button>
               </div>
             </div>
           </div>
         ) : activeTab === 'virtual-colleagues' && activeColleague === 'create-colleague' ? (
           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full w-full flex flex-col overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-white">
               <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                 <UserPlus className="w-6 h-6" />
               </div>
               <div>
                 <h2 className="text-xl font-bold text-gray-800">创建虚拟同事</h2>
                 <p className="text-sm text-gray-500">配置新虚拟同事的角色、权限及工作流能力</p>
               </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
               <div className="max-w-2xl mx-auto space-y-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                 {/* 基本信息 */}
                 <div>
                   <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                     <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">1</span>
                     基本信息
                   </h3>
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">同事姓名</label>
                       <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="例如：财务老王" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">角色设定 / Prompt</label>
                       <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-24" placeholder="描述该同事的工作职责、语气和专业领域..."></textarea>
                     </div>
                   </div>
                 </div>

                 <hr className="border-gray-100" />

                 {/* 权限配置 */}
                 <div>
                   <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                     <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">2</span>
                     权限配置
                   </h3>
                   <div className="grid grid-cols-2 gap-4">
                     <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                       <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked />
                       <div>
                         <div className="text-sm font-medium text-gray-800">读取企业知识库</div>
                         <div className="text-xs text-gray-500 mt-0.5">允许查阅规章制度和历史文档</div>
                       </div>
                     </label>
                     <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                       <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked />
                       <div>
                         <div className="text-sm font-medium text-gray-800">调用业务应用</div>
                         <div className="text-xs text-gray-500 mt-0.5">允许触发审批、下单等应用流</div>
                       </div>
                     </label>
                     <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                       <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300" />
                       <div>
                         <div className="text-sm font-medium text-gray-800">数据修改权限</div>
                         <div className="text-xs text-gray-500 mt-0.5">允许修改系统内的核心业务数据</div>
                       </div>
                     </label>
                     <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                       <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked />
                       <div>
                         <div className="text-sm font-medium text-gray-800">跨部门协作</div>
                         <div className="text-xs text-gray-500 mt-0.5">允许与其他虚拟同事发起对话</div>
                       </div>
                     </label>
                   </div>
                 </div>

                 {/* 动作按钮 */}
                 <div className="pt-4 flex justify-end space-x-3">
                   <button className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                     取消
                   </button>
                   <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                     完成创建
                   </button>
                 </div>
               </div>
             </div>
           </div>
         ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full w-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-lg font-medium">主内容区</p>
              <p className="text-sm mt-1">请在左侧选择对应内容</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
