# LWC DatePicker

<!---Esses são exemplos. Veja https://shields.io para outras pessoas ou para personalizar este conjunto de escudos. Você pode querer incluir dependências, status do projeto e informações de licença aqui--->

![GitHub repo size](https://img.shields.io/github/repo-size/iuricode/README-template?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/iuricode/README-template?style=for-the-badge)

> JS Lighting Web Component date picker component.

This calendar allows to set and visually shows a minimal date for selection.

### Features

Project on development with these features to be worked on:

- [x] Visual adjusts for min dates
- [ ] Set and visual adjusts for max dates
- [ ] Today Button
- [ ] List selection for Year

## How to use

On your parent component html you can add the calendar following the example:
```
<div class="slds-form-element slds-form-element_stacked">
	<c-calendar
		name="FIELD_NAME"
		value={OBJECT.FIELD}
		min={VAR}
		onselectionchange={HANDLER}
		>
	</c-calendar>
</div>
```
