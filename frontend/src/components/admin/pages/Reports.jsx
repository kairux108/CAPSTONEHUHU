import {
  CalendarDays,
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Stethoscope,
  UserPlus,
  UsersRound,
} from "lucide-react";

import CuraCard from "../../common/CuraCard";
import BarGraph from "../../common/BarGraph";

const Reports = () => {
  /*
  |--------------------------------------------------------------------------
  | REAL DATA
  |--------------------------------------------------------------------------
  |
  | These will later come from Laravel.
  |
  */

  const consultationsByDepartment = [];

  const appointmentTrends = [];

  const topServices = [];

  const recentReports = [];

  return (
    <div>
      <div className="reports-page">

        {/* ====================================
            REPORT CONTROLS
        ===================================== */}

        <CuraCard className="reports-filter-card">

          <div className="reports-filters">

            <div className="report-filter-field">
              <label>
                Date Range
              </label>

              <button type="button">
                <CalendarDays size={15} />

                Select date range
              </button>
            </div>


            <div className="report-filter-field">
              <label>
                Report Type
              </label>

              <select>
                <option>
                  All Reports
                </option>

                <option>
                  Consultations
                </option>

                <option>
                  Patients
                </option>

                <option>
                  Appointments
                </option>

                <option>
                  Prescriptions
                </option>
              </select>
            </div>


            <button
              type="button"
              className="report-export-button"
            >
              <FileText size={16} />

              Export PDF
            </button>


            <button
              type="button"
              className="report-export-button"
            >
              <FileSpreadsheet
                size={16}
              />

              Export Excel
            </button>


            <button
              type="button"
              className="report-generate-button"
            >
              <RefreshCw size={16} />

              Generate Report
            </button>

          </div>

        </CuraCard>


        {/* ====================================
            SUMMARY
        ===================================== */}

        <div className="reports-summary-grid">

          <CuraCard className="report-summary-card">

            <div className="report-summary-content">

              <div className="report-summary-icon blue">
                <UsersRound size={22} />
              </div>

              <div>
                <strong>—</strong>

                <p>
                  Total Consultations
                </p>
              </div>

            </div>

          </CuraCard>


          <CuraCard className="report-summary-card">

            <div className="report-summary-content">

              <div className="report-summary-icon green">
                <UserPlus size={22} />
              </div>

              <div>
                <strong>—</strong>

                <p>
                  New Patients
                </p>
              </div>

            </div>

          </CuraCard>


          <CuraCard className="report-summary-card">

            <div className="report-summary-content">

              <div className="report-summary-icon orange">
                <FileText size={22} />
              </div>

              <div>
                <strong>—</strong>

                <p>
                  Prescriptions Issued
                </p>
              </div>

            </div>

          </CuraCard>


          <CuraCard className="report-summary-card">

            <div className="report-summary-content">

              <div className="report-summary-icon pink">
                <CalendarDays size={22} />
              </div>

              <div>
                <strong>—</strong>

                <p>
                  Follow-up Appointments
                </p>
              </div>

            </div>

          </CuraCard>

        </div>


        {/* ====================================
            FIRST GRAPH ROW
        ===================================== */}

        <div className="reports-chart-grid">

          {/* PATIENT VISITS */}

          <CuraCard
            title="Patient Visits Overview"
            className="report-chart-card"
          >
            <div className="report-chart-placeholder">

              <p>
                Patient visit trend
              </p>

              <span>
                Chart data will appear
                when reports are loaded.
              </span>

            </div>
          </CuraCard>


          {/* CONSULTATIONS */}

          <CuraCard
            title="Consultations by Department"
            className="report-chart-card"
          >
            <BarGraph
              data={
                consultationsByDepartment
              }
              orientation="horizontal"
            />
          </CuraCard>


          {/* PATIENT DISTRIBUTION */}

          <CuraCard
            title="Patient Type Distribution"
            className="report-chart-card"
          >
            <div className="report-chart-placeholder">

              <p>
                Patient distribution
              </p>

              <span>
                Distribution data will
                appear here.
              </span>

            </div>
          </CuraCard>

        </div>


        {/* ====================================
            SECOND GRAPH ROW
        ===================================== */}

        <div className="reports-chart-grid">

          {/* APPOINTMENT TRENDS */}

          <CuraCard
            title="Appointment Trends"
            className="report-chart-card"
          >
            <BarGraph
              data={appointmentTrends}
              orientation="vertical"
              valueKey="scheduled"
              secondValueKey="completed"
              firstLabel="Scheduled"
              secondLabel="Completed"
            />
          </CuraCard>


          {/* TOP SERVICES */}

          <CuraCard
            title="Top Services / Diagnoses"
            className="report-chart-card"
          >
            <BarGraph
              data={topServices}
              orientation="horizontal"
            />
          </CuraCard>


          {/* SYSTEM INSIGHTS */}

          <CuraCard
            title="System Insights"
            className="report-chart-card"
          >
            <div className="reports-insights-empty">

              <Stethoscope size={28} />

              <p>
                No insights yet
              </p>

              <span>
                Insights will be generated
                from actual clinic data.
              </span>

            </div>
          </CuraCard>

        </div>


        {/* ====================================
            RECENT REPORTS
        ===================================== */}

        <CuraCard title="Recent Reports">

          <div className="recent-reports-table-wrapper">

            <table className="recent-reports-table">

              <thead>
                <tr>
                  <th>
                    Report Name
                  </th>

                  <th>
                    Report Type
                  </th>

                  <th>
                    Date Generated
                  </th>

                  <th>
                    Date Range
                  </th>

                  <th>
                    Generated By
                  </th>

                  <th>
                    Format
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>

                {recentReports.map(
                  (report) => (
                    <tr key={report.id}>

                      <td>
                        {
                          report.name
                        }
                      </td>

                      <td>
                        {
                          report.type
                        }
                      </td>

                      <td>
                        {
                          report.created_at
                        }
                      </td>

                      <td>
                        {
                          report.date_range
                        }
                      </td>

                      <td>
                        {
                          report.generated_by
                        }
                      </td>

                      <td>
                        {
                          report.format
                        }
                      </td>

                      <td>

                        <button
                          type="button"
                          className="report-download-button"
                        >
                          <Download
                            size={14}
                          />

                          Download
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>


            {recentReports.length === 0 && (
              <div className="reports-table-empty">

                <FileText size={30} />

                <p>
                  No reports generated
                </p>

                <span>
                  Generated reports will
                  appear here.
                </span>

              </div>
            )}

          </div>

        </CuraCard>

      </div>
    </div>
  );
};

export default Reports;