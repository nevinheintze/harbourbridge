import Forms from "../../services/Forms.service.js";
import Actions from "../../services/Action.service.js";

class LoadDbDumpForm extends HTMLElement {

    connectedCallback() {
        this.render();
        if (document.getElementById("loadDatabaseDumpModal")) {
            document.getElementById("loadDatabaseDumpModal")
            .querySelector("i")
            .addEventListener("click", () => {
                Forms.resetLoadDbModal();
            });
        }
        document.getElementById('dump-file-path').addEventListener('focusout', () => {
            Forms.validateInput(document.getElementById('dump-file-path'), 'file-path-error');
        })
        document.getElementById('load-connect-button')?.addEventListener('click', () => {
            Actions.showSpinner()
            this.storeDumpFileValues(document.getElementById("load-db-type").value, document.getElementById("dump-file-path").value);
        });

        Forms.formButtonHandler("load-db-form", "load-connect-button");
    }

    storeDumpFileValues = async (dbType, filePath) => {
        let sourceTableFlag = '', loadDbDumpApiRes, ddlSummaryApiRes, globalDbType = '';
        if (dbType === 'mysql') {
            globalDbType = dbType + 'dump';
            sourceTableFlag = 'MySQL';
            Actions.setSourceDbName(sourceTableFlag)
        }
        else if (dbType === 'postgres') {
            globalDbType = 'pg_dump'
            sourceTableFlag = 'Postgres';
            Actions.setSourceDbName(sourceTableFlag)

        }
        loadDbDumpApiRes = await Actions.onLoadDatabase(globalDbType, filePath);
        ddlSummaryApiRes = await Actions.ddlSummaryAndConversionApiCall();
        await Actions.setGlobalDataTypeList();

        if (loadDbDumpApiRes && ddlSummaryApiRes) {
            window.location.href = '#/schema-report';
            Actions.sessionRetrieval(Actions.getSourceDbName());
        } else {
            Actions.hideSpinner()
        }
    }

    render() {
        this.innerHTML = `
            <div>
                <label for="load-db-type">Database Type</label>
                <select class="form-control load-db-input" id="load-db-type" name="load-db-type">
                    <option class="template"></option>
                    <option value="mysql">MySQL</option>
                    <option value="postgres">Postgres</option>
                </select>
            </div>
            <form id="load-db-form">
                <div>
                    <label for="dump-file-path">Path of the Dump File</label>
                    <input class="form-control load-db-input" type="text" name="dump-file-path" id="dump-file-path"
                        autocomplete="off" />
                    <span class='form-error' id='file-path-error'></span>
                </div>
                <input type="text" class="template" value="dummyInput">
            </form>
        `;
    }

    constructor() {
        super();
    }
}

window.customElements.define('hb-load-db-dump-form', LoadDbDumpForm);