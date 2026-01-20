/**
 * Example plugin demonstrating the Journal API.
 * 
 * Adds a status bar button that:
 * 1. Finds the Journal plugin in your workspace
 * 2. Gets the journal page for next week
 * 3. Adds a task to that journal page (creates page as needed)
 * 4. Navigates to the journal page
 * 
 * This demonstrates:
 * - Finding a specific plugin type using isJournalPlugin()
 * - Getting journal records with getJournalRecord()
 * - Creating line items programmatically
 * - Navigating to journal pages with navigateToJournal()
 */

class Plugin extends AppPlugin {

	onLoad() {
		this.ui.addStatusBarItem({
			icon: 'ti-calendar',
			tooltip: "Add task to next week's journal",
			onClick: () => this.addTaskToNextWeek()
		});
	}

	async addTaskToNextWeek() {
		const user = this.data.getActiveUsers()[0];
		const panel = this.ui.getActivePanel();
		const collections = await this.data.getAllCollections();
		const journal = collections.find(c => c.isJournalPlugin());

		if (journal && panel && user) {
			const nextWeek = DateTime.parseDateTimeString('7 days from now');
			const record = await journal.getJournalRecord(user, nextWeek);
			if (record) {
				const line = await record.createLineItem(null, null, 'task');
				line.setSegments([{ type: 'text', text: 'Plan for ' + nextWeek.toDate().toLocaleDateString() }]);
			}

			panel.navigateToJournal(user, nextWeek);
		}
	}

}
