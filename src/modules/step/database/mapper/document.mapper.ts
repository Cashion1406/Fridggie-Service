import { Document } from '../../domain/document'
import { DocumentEntity } from '../entities/document.entity'

export class DocumentMapper {
	// convert document entity to document domain
	toDomain(document: DocumentEntity) {
		return new Document({
			id: document.id,
			name: document.name,
			type: document.type,
			url: document?.url,
		})
	}

	// convert document domain to document entity
	toOrm(document: Document) {
		return new DocumentEntity(document.serialize())
	}
}
