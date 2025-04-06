import { type IMThemeVariables, css, type SerializedStyles, polished } from 'jimu-core'

export function getPanelStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
    .system-config-panel {
      .wkid-link {
        cursor: pointer;
        color: ${polished.rgba(theme.sys.color.primary.light, 0.8)};
        padding: 3px 2px;
        font-size: ${polished.rem(12)};
        text-decoration: none;
        &:hover {
          color: ${theme.sys.color.primary.light};
        }
      }
      .system-name {
        font-style: italic;
        font-size: 12px;
        color: ${theme.ref.palette.neutral[1000]};
        margin-top: 5px;
        .invalid-tips {
          width: calc(100% - 20px);
          margin: 0 4px;
          color: ${theme.sys.color.error.main}
        }
      }
    }
  `
}

export function getSettingStyle (theme: IMThemeVariables): SerializedStyles {
  return css`
    .empty-placeholder {
      display: flex;
      flex-flow: column;
      justify-content: center;
      height: calc(100% - 255px);
      overflow: hidden;
      .empty-placeholder-inner {
        padding: 0px 20px;
        flex-direction: column;
        align-items: center;
        display: flex;
        .empty-placeholder-text {
          color: ${theme.ref.palette.neutral[1000]};
          font-size: ${polished.rem(14)};
          margin-top: 16px;
          text-align: center;
        }
        .empty-placeholder-icon {
          color: ${theme.ref.palette.neutral[800]};
        }
      }
    }
    .arrange-style-container {
      .arrange_container {
        margin-top: 10px;
        display: flex;
        .jimu-btn {
          padding: 0;
          background: ${theme.ref.palette.neutral[300]};
          &.active {
            border: 2px solid ${theme.sys.color.primary.light};
          }
        }
      }
    }
    .setting-ui-unit-list-new {
      padding-top: ${polished.rem(8)};
    }
  `
}
