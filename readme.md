# AWS Security Group Add IP Action

這個 GitHub Action 允許您將當前的Public IP 地址添加到指定的 AWS Security Group 中，並在Workflow結束後自動移除。

## 功能

- 自動檢測當前的Public IP 地址
- 將 IP 地址添加到指定的 AWS Security Group
- 支持自定義 port 
- 在 Workflow 結束後自動移除添加的 IP 地址

## 使用方法

要使用此 action，請在您的 workflow 中添加以下步驟：

```yaml
- name : Add IP to Security Group
    uses: bbinmkt-organization/aws-security-group-add-ip-action@main
    with:
        aws-access-key-id: AWS Access Key ID 
        aws-secret-access-key: AWS Secret Access Key 
        aws-region: region
        aws-security-group-id: sc id
```

## 輸入參數

| 參數                      | 描述                     | 必填 |     默認值     |
| ------------------------- | ------------------------ | :--: | :-------------: |
| `aws-access-key-id`     | AWS Access Key ID        |  是  |        -        |
| `aws-secret-access-key` | AWS Secret Access Key    |  是  |        -        |
| `aws-region`            | AWS 區域                  |  是  |        -        |
| `aws-security-group-id` | AWS Security Group ID    |  是  |        -        |
| `port`                  | 要允許的端口               |  否  |      '22'      |
| `to-port`               | 要允許的結束端口（範圍）     |  否  |        -        |
| `protocol`              | 規則的協議                 |  否  |      'tcp'      |
| `description`           | IP 權限的描述              |  否  | 'GitHub Action' |

## 注意事項

- 確保您的 AWS 憑證具有修改指定安全組的權限。
- 此 action 會在工作流程結束時自動移除添加的 IP 地址，以確保安全性。

