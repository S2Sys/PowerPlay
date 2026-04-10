import {
  HelmDeploymentSpec,
  HelmChartFile,
  HelmChartOutput,
} from './types';

/**
 * HelmChartGenerator — generates complete Helm charts from Docker image specs.
 * Produces 6 files: Chart.yaml, values.yaml, and 4 templates (deployment, service, ingress, configmap).
 */
export class HelmChartGenerator {
  /**
   * Generate complete Helm chart from deployment spec.
   */
  generate(spec: HelmDeploymentSpec): HelmChartOutput {
    const chartName = this.deriveChartName(spec.imageName);
    const chartVersion = '1.0.0';

    const files: HelmChartFile[] = [
      {
        path: 'Chart.yaml',
        content: this.generateChartYaml(spec, chartName, chartVersion),
      },
      {
        path: 'values.yaml',
        content: this.generateValuesYaml(spec),
      },
      {
        path: 'templates/deployment.yaml',
        content: this.generateDeploymentTemplate(spec),
      },
      {
        path: 'templates/service.yaml',
        content: this.generateServiceTemplate(spec),
      },
      {
        path: 'templates/ingress.yaml',
        content: this.generateIngressTemplate(spec),
      },
      {
        path: 'templates/configmap.yaml',
        content: this.generateConfigMapTemplate(spec),
      },
    ];

    const installCommand = `helm install ${chartName} ./${chartName}`;
    const upgradeCommand = `helm upgrade ${chartName} ./${chartName}`;

    return {
      chartName,
      chartVersion,
      files,
      installCommand,
      upgradeCommand,
      timestamp: Date.now(),
    };
  }

  /**
   * Generate Chart.yaml.
   */
  generateChartYaml(spec: HelmDeploymentSpec, chartName: string, chartVersion: string): string {
    const imageParts = spec.imageName.split(':');
    const appVersion = imageParts.length > 1 ? imageParts[1] : 'latest';

    return `apiVersion: v1
kind: Chart
name: ${chartName}
description: Auto-generated Helm chart for ${spec.imageName}
type: application
version: ${chartVersion}
appVersion: ${appVersion}
author: PowerPlay Generator
home: https://example.com
sources:
  - https://github.com/example/repo
maintainers:
  - name: DevOps Team
    email: devops@example.com
`;
  }

  /**
   * Generate values.yaml.
   */
  generateValuesYaml(spec: HelmDeploymentSpec): string {
    const imageParts = spec.imageName.split(':');
    const repository = imageParts[0];
    const tag = imageParts.length > 1 ? imageParts[1] : 'latest';

    let yaml = `# Default values for this Helm chart
replicaCount: ${spec.replicas}

image:
  repository: ${repository}
  tag: "${tag}"
  pullPolicy: IfNotPresent

imagePullSecrets: []

resources:
  requests:
    cpu: ${spec.resources.requests.cpu}
    memory: ${spec.resources.requests.memory}
  limits:
    cpu: ${spec.resources.limits.cpu}
    memory: ${spec.resources.limits.memory}

service:
  type: ClusterIP
  ports:
`;

    for (const port of spec.ports) {
      yaml += `    - name: ${port.name}
      containerPort: ${port.containerPort}
      servicePort: ${port.servicePort}
`;
    }

    yaml += `
env:
`;
    for (const envVar of spec.envVars) {
      if (envVar.secret) {
        yaml += `  - name: ${envVar.name}
    valueFrom:
      secretKeyRef:
        name: {{ .Release.Name }}-secrets
        key: ${envVar.name}
`;
      } else {
        yaml += `  - name: ${envVar.name}
    value: "${envVar.value}"
`;
      }
    }

    yaml += `
ingress:
  enabled: ${spec.ingress?.enabled ?? false}
`;
    if (spec.ingress?.enabled) {
      yaml += `  host: ${spec.ingress.host}
  path: ${spec.ingress.path ?? '/'}
  tlsEnabled: ${spec.ingress.tlsEnabled ?? false}
`;
    }

    yaml += `
configMap:
  enabled: ${!!spec.configMap && Object.keys(spec.configMap).length > 0}
`;
    if (spec.configMap && Object.keys(spec.configMap).length > 0) {
      yaml += `  data:
`;
      for (const [key, value] of Object.entries(spec.configMap)) {
        yaml += `    ${key}: "${value}"
`;
      }
    }

    return yaml;
  }

  /**
   * Generate templates/deployment.yaml.
   */
  generateDeploymentTemplate(spec: HelmDeploymentSpec): string {
    let yaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}
  labels:
    app: {{ .Chart.Name }}
    version: {{ .Chart.Version }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Release.Name }}
  template:
    metadata:
      labels:
        app: {{ .Release.Name }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
`;

    for (const port of spec.ports) {
      yaml += `        - name: ${port.name}
          containerPort: ${port.containerPort}
          protocol: TCP
`;
    }

    yaml += `        resources:
          requests:
            cpu: {{ .Values.resources.requests.cpu }}
            memory: {{ .Values.resources.requests.memory }}
          limits:
            cpu: {{ .Values.resources.limits.cpu }}
            memory: {{ .Values.resources.limits.memory }}
        env:
`;

    for (const envVar of spec.envVars) {
      yaml += `        - name: ${envVar.name}
`;
      if (envVar.secret) {
        yaml += `          valueFrom:
            secretKeyRef:
              name: {{ .Release.Name }}-secrets
              key: ${envVar.name}
`;
      } else {
        yaml += `          value: "{{ .Values.env | index (print \"${envVar.name}\") }}"
`;
      }
    }

    yaml += `        livenessProbe:
          httpGet:
            path: /health
            port: ${spec.ports[0]?.containerPort ?? 8080}
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: ${spec.ports[0]?.containerPort ?? 8080}
          initialDelaySeconds: 5
          periodSeconds: 5
`;

    if (spec.configMap && Object.keys(spec.configMap).length > 0) {
      yaml += `        volumeMounts:
        - name: config
          mountPath: /etc/config
      volumes:
      - name: config
        configMap:
          name: {{ .Release.Name }}-config
`;
    }

    return yaml;
  }

  /**
   * Generate templates/service.yaml.
   */
  generateServiceTemplate(spec: HelmDeploymentSpec): string {
    let yaml = `apiVersion: v1
kind: Service
metadata:
  name: {{ .Release.Name }}
  labels:
    app: {{ .Chart.Name }}
spec:
  type: {{ .Values.service.type }}
  ports:
`;

    for (const port of spec.ports) {
      yaml += `  - port: ${port.servicePort}
    targetPort: ${port.containerPort}
    protocol: TCP
    name: ${port.name}
`;
    }

    yaml += `  selector:
    app: {{ .Release.Name }}
`;

    return yaml;
  }

  /**
   * Generate templates/ingress.yaml (conditional).
   */
  generateIngressTemplate(spec: HelmDeploymentSpec): string {
    if (!spec.ingress?.enabled) {
      return `# Ingress disabled in values.yaml
# To enable, set ingress.enabled to true in values.yaml
`;
    }

    let yaml = `{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Release.Name }}
  labels:
    app: {{ .Chart.Name }}
spec:
  ingressClassName: nginx
  rules:
  - host: {{ .Values.ingress.host }}
    http:
      paths:
      - path: {{ .Values.ingress.path | default "/" }}
        pathType: Prefix
        backend:
          service:
            name: {{ .Release.Name }}
            port:
              number: {{ .Values.service.ports[0].servicePort }}
`;

    if (spec.ingress.tlsEnabled) {
      yaml += `  tls:
  - hosts:
    - {{ .Values.ingress.host }}
    secretName: {{ .Release.Name }}-tls
`;
    }

    yaml += `{{- end }}
`;

    return yaml;
  }

  /**
   * Generate templates/configmap.yaml (conditional).
   */
  generateConfigMapTemplate(spec: HelmDeploymentSpec): string {
    if (!spec.configMap || Object.keys(spec.configMap).length === 0) {
      return `# ConfigMap disabled (no data in values.yaml)
# To enable, add configMap.data entries to values.yaml
`;
    }

    let yaml = `{{- if .Values.configMap.enabled }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-config
  labels:
    app: {{ .Chart.Name }}
data:
`;

    for (const [key, value] of Object.entries(spec.configMap)) {
      yaml += `  ${key}: |
    ${value}
`;
    }

    yaml += `{{- end }}
`;

    return yaml;
  }

  /**
   * Derive chart name from image name (strip tag, replace / with -).
   */
  private deriveChartName(imageName: string): string {
    let name = imageName.split(':')[0]; // Remove tag
    name = name.replace(/\//g, '-'); // Replace / with -
    return name.toLowerCase();
  }

  reset(): void {
    // No internal state to reset
  }
}

export function createHelmChartGenerator(): HelmChartGenerator {
  return new HelmChartGenerator();
}
