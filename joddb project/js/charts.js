~~~{"variant":"standard","title":"Updated charts.js with new colors","id":"87122"}
document.addEventListener('DOMContentLoaded', function(){
    const data = window.dashboardData || {};


(function(){
    const ctx = document.getElementById('barChart').getContext('2d');
    const labels = Object.keys(data.projects_status || {});
    const values = Object.values(data.projects_status || {});

    // 🧩 استبدال الأسماء حسب المطلوب
    const newLabels = labels.map(label => {
        if (label.toLowerCase().includes('quality')) return 'Nitrogen';
        if (label.toLowerCase().includes('adjustment')) return 'RTV';
        return label; // في حال لم ينطبق أي شرط
    });

    // 🎨 إنشاء التدرّج الحاد (أزرق ثم أحمر فجأة)
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    gradient.addColorStop(0, '#3064E7');
    gradient.addColorStop(0.75, '#3064E7');
    gradient.addColorStop(0.751, '#C62828');
    gradient.addColorStop(1, '#C62828');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: newLabels,
            datasets: [{
                label: 'Operation success rate',
                data: values,
                backgroundColor: gradient,
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 25
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: '#e0e0e0' },
                    ticks: { color: '#333', stepSize: 5 }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        color: '#333',
                        font: { size: 13, weight: '600' }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Operation success rate',
                    color: '#000',
                    font: { size: 18, weight: 'bold' },
                    padding: { bottom: 20 }
                },
                legend: { display: false }
            },
            layout: {
                padding: { left: 40, right: 10, top: 10, bottom: 10 }
            }
        }
    });
})();


    // Pie chart - Projects status distribution
    (function(){
        const ctx = document.getElementById('pieChart').getContext('2d');
        const labels = Object.keys(data.projects_status_distribution || {});
        const values = Object.values(data.projects_status_distribution || {});
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: ['#3064E7', '#24D800', '#868585']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    })();

    // Vertical bar chart - Estimated vs Real Time
    (function(){
        const ctx = document.getElementById('verticalBarChart').getContext('2d');
        const t = data.time_chart || {labels:[],estimated:[],real:[]};
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: t.labels,
                datasets: [
                    { label: 'Estimated', data: t.estimated, backgroundColor: '#3064E7' },
                    { label: 'Real time', data: t.real, backgroundColor: '#24D800' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } },
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    })();
});
