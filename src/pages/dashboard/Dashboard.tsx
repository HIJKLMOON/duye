import { useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, FileTextOutlined, RiseOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const Dashboard: React.FC = () => {
  useEffect(() => {
    (window as any).__headerExtra = null;
  }, []);

  const lineChartOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['用户', '订单', '收入'],
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '用户',
        type: 'line',
        data: [120, 200, 150, 80, 70, 110],
        smooth: true,
      },
      {
        name: '订单',
        type: 'line',
        data: [100, 150, 120, 60, 50, 90],
        smooth: true,
      },
      {
        name: '收入',
        type: 'line',
        data: [50, 80, 70, 40, 30, 60],
        smooth: true,
      },
    ],
  };

  const pieChartOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '搜索引擎' },
          { value: 735, name: '直接访问' },
          { value: 580, name: '邮件营销' },
          { value: 484, name: '联盟广告' },
          { value: 300, name: '视频广告' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <div className="space-y-4">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={112893}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="角色数"
              value={93}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="订单数"
              value={893}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总收入"
              value={89300}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#f5222d' }}
              suffix="元"
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="数据统计" className="h-[400px]">
            <ReactECharts option={lineChartOption} style={{ height: '350px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="访问来源" className="h-[400px]">
            <ReactECharts option={pieChartOption} style={{ height: '350px' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;