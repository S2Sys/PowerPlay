import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { HelmChartGenerator, createHelmChartGenerator } from '../src/orchestrator/parallel/helm-chart-generator';
import { HelmDeploymentSpec } from '../src/orchestrator/parallel/types';

describe('HelmChartGenerator', () => {
  let generator: HelmChartGenerator;

  beforeEach(() => {
    generator = createHelmChartGenerator();
  });

  afterEach(() => {
    generator.reset();
  });

  describe('generateChartYaml', () => {
    it('should contain name, version, appVersion fields', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'myapp/api:1.2.0',
        replicas: 3,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const chart = output.files.find(f => f.path === 'Chart.yaml');
      expect(chart).toBeDefined();
      expect(chart!.content).toContain('name:');
      expect(chart!.content).toContain('version:');
      expect(chart!.content).toContain('appVersion:');
    });

    it('should extract appVersion from image tag', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'myapp:2.5.1',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const chart = output.files.find(f => f.path === 'Chart.yaml');
      expect(chart!.content).toContain('appVersion: 2.5.1');
    });

    it('should mark type as application', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'test:1.0.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 3000, servicePort: 3000 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const chart = output.files.find(f => f.path === 'Chart.yaml');
      expect(chart!.content).toContain('type: application');
    });
  });

  describe('generateValuesYaml', () => {
    it('should contain image.repository and image.tag', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'mycompany/app:v1.0.0',
        replicas: 3,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const values = output.files.find(f => f.path === 'values.yaml');
      expect(values!.content).toContain('repository: mycompany/app');
      expect(values!.content).toContain('tag: "v1.0.0"');
    });

    it('should include replicaCount from spec', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 5,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const values = output.files.find(f => f.path === 'values.yaml');
      expect(values!.content).toContain('replicaCount: 5');
    });

    it('should include resource requests and limits', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '250m', memory: '256Mi' }, limits: { cpu: '1000m', memory: '1024Mi' } },
      };
      const output = generator.generate(spec);
      const values = output.files.find(f => f.path === 'values.yaml');
      expect(values!.content).toContain('250m');
      expect(values!.content).toContain('256Mi');
      expect(values!.content).toContain('1000m');
      expect(values!.content).toContain('1024Mi');
    });

    it('should handle environment variables (plain)', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [{ name: 'DATABASE_URL', value: 'postgres://localhost/db', secret: false }],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const values = output.files.find(f => f.path === 'values.yaml');
      expect(values!.content).toContain('DATABASE_URL');
    });

    it('should handle ingress configuration', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
        ingress: { enabled: true, host: 'example.com', path: '/', tlsEnabled: true },
      };
      const output = generator.generate(spec);
      const values = output.files.find(f => f.path === 'values.yaml');
      expect(values!.content).toContain('enabled: true');
      expect(values!.content).toContain('example.com');
    });
  });

  describe('generateDeploymentTemplate', () => {
    it('should use Helm template syntax for Values references', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const deployment = output.files.find(f => f.path === 'templates/deployment.yaml');
      expect(deployment!.content).toContain('{{ .Values.replicaCount }}');
      expect(deployment!.content).toContain('{{ .Values.image.repository }}');
    });

    it('should include liveness and readiness probes', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const deployment = output.files.find(f => f.path === 'templates/deployment.yaml');
      expect(deployment!.content).toContain('livenessProbe');
      expect(deployment!.content).toContain('readinessProbe');
      expect(deployment!.content).toContain('httpGet');
    });

    it('should include resource limits from Values', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const deployment = output.files.find(f => f.path === 'templates/deployment.yaml');
      expect(deployment!.content).toContain('{{ .Values.resources.limits.cpu }}');
      expect(deployment!.content).toContain('{{ .Values.resources.limits.memory }}');
    });

    it('should reference secretKeyRef for secret env vars', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [{ name: 'API_KEY', value: 'secret', secret: true }],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const deployment = output.files.find(f => f.path === 'templates/deployment.yaml');
      expect(deployment!.content).toContain('secretKeyRef');
    });
  });

  describe('generateServiceTemplate', () => {
    it('should set type to ClusterIP', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const service = output.files.find(f => f.path === 'templates/service.yaml');
      expect(service!.content).toContain('type: {{ .Values.service.type }}');
    });

    it('should map containerPort to servicePort', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [
          { name: 'http', containerPort: 8080, servicePort: 80 },
          { name: 'grpc', containerPort: 9090, servicePort: 9090 },
        ],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const service = output.files.find(f => f.path === 'templates/service.yaml');
      expect(service!.content).toContain('port: 80');
      expect(service!.content).toContain('targetPort: 8080');
    });
  });

  describe('generateIngressTemplate', () => {
    it('should use conditional {{- if .Values.ingress.enabled }}', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
        ingress: { enabled: true, host: 'api.example.com' },
      };
      const output = generator.generate(spec);
      const ingress = output.files.find(f => f.path === 'templates/ingress.yaml');
      expect(ingress!.content).toContain('{{- if .Values.ingress.enabled }}');
    });

    it('should include host and path from spec', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
        ingress: { enabled: true, host: 'myapp.example.com', path: '/api' },
      };
      const output = generator.generate(spec);
      const ingress = output.files.find(f => f.path === 'templates/ingress.yaml');
      expect(ingress!.content).toContain('myapp.example.com');
      expect(ingress!.content).toContain('/api');
    });

    it('should include TLS block when tlsEnabled is true', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
        ingress: { enabled: true, host: 'secure.example.com', tlsEnabled: true },
      };
      const output = generator.generate(spec);
      const ingress = output.files.find(f => f.path === 'templates/ingress.yaml');
      expect(ingress!.content).toContain('tls:');
      expect(ingress!.content).toContain('secretName:');
    });

    it('should produce comment stub when ingress disabled', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const ingress = output.files.find(f => f.path === 'templates/ingress.yaml');
      expect(ingress!.content).toContain('disabled');
    });
  });

  describe('generateConfigMapTemplate', () => {
    it('should include configmap key-value pairs', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
        configMap: { LOG_LEVEL: 'debug', DB_POOL_SIZE: '20' },
      };
      const output = generator.generate(spec);
      const cm = output.files.find(f => f.path === 'templates/configmap.yaml');
      expect(cm!.content).toContain('LOG_LEVEL');
      expect(cm!.content).toContain('debug');
    });

    it('should produce stub comment when configMap empty', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const cm = output.files.find(f => f.path === 'templates/configmap.yaml');
      expect(cm!.content).toContain('disabled');
    });
  });

  describe('generate', () => {
    it('should return exactly 6 HelmChartFile entries', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 2,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      expect(output.files.length).toBe(6);
    });

    it('should follow correct Helm directory structure', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const paths = output.files.map(f => f.path);
      expect(paths).toContain('Chart.yaml');
      expect(paths).toContain('values.yaml');
      expect(paths.some(p => p.startsWith('templates/'))).toBe(true);
    });

    it('should derive chartName from imageName', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'registry.io/company/myapp:2.0.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      expect(output.chartName).toContain('myapp');
    });

    it('should include helm install command', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      expect(output.installCommand).toContain('helm install');
    });

    it('should include helm upgrade command', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      expect(output.upgradeCommand).toContain('helm upgrade');
    });

    it('should include recent timestamp', () => {
      const before = Date.now();
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const after = Date.now();
      expect(output.timestamp).toBeGreaterThanOrEqual(before);
      expect(output.timestamp).toBeLessThanOrEqual(after + 1000);
    });
  });

  describe('edge cases', () => {
    it('should handle imageName with no tag (defaults to latest)', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'myapp',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const values = output.files.find(f => f.path === 'values.yaml');
      expect(values!.content).toContain('tag: "latest"');
    });

    it('should handle zero env vars', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      expect(output.files.length).toBe(6);
    });

    it('should handle multiple ports', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'app:1.0',
        replicas: 1,
        ports: [
          { name: 'http', containerPort: 8080, servicePort: 80 },
          { name: 'grpc', containerPort: 9090, servicePort: 9090 },
          { name: 'metrics', containerPort: 8081, servicePort: 8081 },
        ],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const service = output.files.find(f => f.path === 'templates/service.yaml');
      expect(service!.content.match(/port:/g)?.length).toBeGreaterThanOrEqual(3);
    });

    it('should handle image name with registry prefix', () => {
      const spec: HelmDeploymentSpec = {
        imageName: 'registry.example.com/org/app:1.2.3',
        replicas: 1,
        ports: [{ name: 'http', containerPort: 8080, servicePort: 8080 }],
        envVars: [],
        resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } },
      };
      const output = generator.generate(spec);
      const values = output.files.find(f => f.path === 'values.yaml');
      expect(values!.content).toContain('registry.example.com/org/app');
    });
  });
});
