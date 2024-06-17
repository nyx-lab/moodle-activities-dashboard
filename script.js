document.addEventListener('DOMContentLoaded', () => {
  fetch('atividades_moodle.json')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const coursesSection = document.getElementById('courses-section');

      const convertDateToBrazilianFormat = (dateStr) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', options);
      };

      const isActive = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        return due >= now;
      };

      Object.keys(data).forEach(courseName => {
        console.log(courseName);
        
        const activities = data[courseName].map(activity => {
          return {
            ...activity,
            is_active: isActive(activity.due_date)
          };
        });

        const activeActivities = activities.filter(activity => activity.is_active);
        console.log(activeActivities.length);

        if (activeActivities.length > 0) {
          const courseArticle = document.createElement('article');
          courseArticle.classList.add('course');

          const courseTitle = document.createElement('h2');
          courseTitle.textContent = courseName;
          courseTitle.title = courseName;
          courseArticle.appendChild(courseTitle);

          activeActivities.forEach(activity => {
            const activityDiv = document.createElement('div');
            activityDiv.classList.add('activity');
            if (activity.is_active) {
              activityDiv.classList.add('active');
            }

            const activityName = document.createElement('h3');
            const activityLink = document.createElement('a');
            activityLink.href = activity.link;
            activityLink.textContent = activity.name;
            activityName.appendChild(activityLink);
            activityDiv.appendChild(activityName);

            const dueDate = document.createElement('p');
            dueDate.textContent = `Entrega: ${convertDateToBrazilianFormat(activity.due_date)}`;
            activityDiv.appendChild(dueDate);

            const activityFooter = document.createElement('div');
            activityFooter.classList.add('activity-footer');

            const viewLink = document.createElement('a');
            viewLink.href = activity.link;
            viewLink.textContent = 'View Assignment';
            viewLink.target = '_blank';
            activityFooter.appendChild(viewLink);

            const activityType = document.createElement('span');
            activityType.classList.add('category');
            activityType.textContent = `# ${activity.type === 'assignment' ? 'tarefa' : activity.type}`;
            activityFooter.appendChild(activityType);

            activityDiv.appendChild(activityFooter);
            courseArticle.appendChild(activityDiv);
          });

          coursesSection.appendChild(courseArticle);
        }
      });
    })
    .catch(error => console.error('Error fetching the data:', error));
});
